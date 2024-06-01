import { Author } from '@/shared/aiTypesAndMappers'
import { DEFAULT_AI_MODEL } from '@/shared/globalConfig'
import { ShareScope, UserAccessLevel } from '@/shared/globalTypes'
import { faker } from '@faker-js/faker'
import type { App, PrismaClient } from '@prisma/client'
import { WorkspaceFactory } from './WorkspaceFactory'
import { generateBaseForDefaults } from './utils/testingFactoryUtils'

type PostFactoryFields = {
  userId: string
} & Partial<App>

const generateDefaults = () => {
  return {
    ...generateBaseForDefaults(),
    title: faker.lorem.sentence(),
  }
}

export const PostFactory = {
  build: (overrides: PostFactoryFields) => {
    return {
      ...generateDefaults(),
      ...overrides,
    }
  },

  create: async (prisma: PrismaClient, overrides: PostFactoryFields) => {
    const { workspaceId, ...rest } = PostFactory.build(overrides)
    const sharesPayload = {
      create: [
        {
          scope: ShareScope.Private,
          shareTargets: {
            create: [
              {
                sharerId: rest.userId,
                userId: rest.userId,
                accessLevel: UserAccessLevel.Owner,
              },
            ],
          },
        },
      ],
    }

    if (workspaceId) {
      return await prisma.app.create({
        data: {
          workspaceId,
          shares: sharesPayload,
          appConfigVersions: {
            create: [
              {
                model: DEFAULT_AI_MODEL,
                messages: {
                  create: [
                    {
                      author: Author.System,
                    },
                  ],
                },
              },
            ],
          },
          ...PostFactory.build(rest),
        },
      })
    }

    const workspace = await WorkspaceFactory.create(prisma)

    return await prisma.app.create({
      data: {
        ...rest,
        workspaceId: workspace.id,
        shares: sharesPayload,
      },
    })
  },
}

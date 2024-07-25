import { createUserOnWorkspaceContext } from '@/server/auth/userOnWorkspaceContext'
import { prisma } from '@/server/db'
import { UserFactory } from '@/server/testing/factories/UserFactory'
import { WorkspaceFactory } from '@/server/testing/factories/WorkspaceFactory'
import { ShareScope } from '@/shared/globalTypes'
import { initialModelSetupService } from '../initialModelSetup.service'
import { onboardingTexts } from '../onboardingTexts'

describe('initialModelSetupService', () => {
  const subject = async () => {
    const workspace = await WorkspaceFactory.create(prisma)
    const user = await UserFactory.create(prisma, { workspaceId: workspace.id })
    const uowContext = await createUserOnWorkspaceContext(
      prisma,
      workspace.id,
      user.id,
    )
    return await initialModelSetupService(prisma, uowContext)
    return user
  }

  it('creates a default app', async () => {
    const user = await subject()

    const app = await prisma.app.findFirstOrThrow({
      where: {
        userId: user.id,
      },
      include: {
        shares: true,
      },
    })

    expect(app).toMatchObject({
      title: 'Fun facts teller',
    })
    expect(app.shares[0]!.scope).toBe(ShareScope.Everybody.toString())
  })

  it('creates the default instructions', async () => {
    const user = await subject()

    const app = await prisma.app.findFirstOrThrow({
      where: {
        userId: user.id,
      },
      include: {
        appConfigVersions: true,
      },
    })

    expect(app.appConfigVersions[0]!.description).toBe(
      onboardingTexts.description,
    )
  })

  it('creates the default system message', async () => {
    const user = await subject()

    const message = await prisma.message.findFirstOrThrow({
      where: {
        appConfigVersion: {
          app: {
            userId: user.id,
          },
        },
      },
    })

    expect(message).toMatchObject({
      message: onboardingTexts.systemMessage,
    })
  })
})

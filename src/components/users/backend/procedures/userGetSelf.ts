import { protectedProcedure } from '@/server/trpc/trpc'
import { getUserService } from '@/server/users/services/getUser.service'
import { getUserWorkspacesService } from '@/server/users/services/getUserWorkspaces.service'
import { TRPCError } from '@trpc/server'
import { zodUserOutput } from '../usersBackendUtils'

export const userGetSelf = protectedProcedure
  .output(zodUserOutput)
  .query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const select = {
      id: true,
      email: true,
      name: true,
      defaultModel: true,
    }

    const [user, workspaces] = await Promise.all([
      await getUserService(ctx.prisma, userId, { select }),
      await getUserWorkspacesService(ctx.prisma, userId, {
        select: { id: true, name: true, onboardingCompletedAt: true },
      }),
    ])

    if (!workspaces.length) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'At least one workspace is required for a user',
      })
    }

    return {
      ...user,
      defaultModel: user.defaultModel!,
      workspace: {
        id: workspaces[0]!.id,
        name: workspaces[0]!.name,
        onboardingCompletedAt: workspaces[0]!.onboardingCompletedAt,
      },
    }
  })

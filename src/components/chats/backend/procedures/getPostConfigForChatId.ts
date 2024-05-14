import { createUserOnWorkspaceContext } from '@/server/auth/userOnWorkspaceContext'
import { getApplicablePostConfigToChatService } from '@/server/chats/services/getApplicablePostConfigToChat.service'
import { prisma } from '@/server/db'
import { protectedProcedure } from '@/server/trpc/trpc'
import { z } from 'zod'

const zGetById = z.object({
  chatId: z.string(),
})

export const getPostConfigForChatId = protectedProcedure
  .input(zGetById)
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    const chat = await ctx.prisma.chat.findFirstOrThrow({
      where: {
        id: input.chatId,
      },
      include: {
        post: {
          select: {
            workspaceId: true,
          },
        },
      },
    })

    const context = await createUserOnWorkspaceContext(
      ctx.prisma,
      chat.post.workspaceId,
      userId,
    )

    return await getApplicablePostConfigToChatService(prisma, context, input)
  })
z

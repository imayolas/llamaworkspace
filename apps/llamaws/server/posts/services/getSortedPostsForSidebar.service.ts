import { Prisma } from '@prisma/client'
import { type UserOnWorkspaceContext } from 'server/auth/userOnWorkspaceContext'
import type { PrismaClientOrTrxClient } from 'shared/globalTypes'
import { getPostsListService } from './getPostsList.service'

interface PostIdWithPosition {
  id: string
  title: string | null
  emoji: string | null
  position: number | null
  updatedAt: Date
}

export const getSortedPostsForSidebarService = async function (
  prisma: PrismaClientOrTrxClient,
  uowContext: UserOnWorkspaceContext,
) {
  const { userId, workspaceId } = uowContext

  const visiblePosts = await getPostsListService(prisma, uowContext)
  const visiblePostIds = visiblePosts.map((post) => post.id)

  // Keep this early return to avoid Prisma.join to fail when the array is empty
  if (!visiblePostIds.length) {
    return []
  }

  const result = await prisma.$queryRaw`
    SELECT
      "Post"."id" as "id",
      "Post"."title" as "title",
      "Post"."emoji" as "emoji",
      "AppsOnUsers"."position" as "position",
      max("AppsOnUsers"."updatedAt") as "updatedAt"
    FROM "Post"
    LEFT JOIN "AppsOnUsers" ON "Post"."id" = "AppsOnUsers"."appId"
    WHERE "Post"."workspaceId" = ${workspaceId}
    AND "Post"."isDefault" = false
    AND "Post"."id" IN (${Prisma.join(visiblePostIds)})
    AND "AppsOnUsers"."userId" = ${userId}
    AND "AppsOnUsers"."position" IS NOT NULL
    GROUP BY 1,2,3,4
    ORDER BY "position" ASC
  `

  return result as PostIdWithPosition[]
}
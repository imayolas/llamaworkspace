import type { UserOnWorkspaceContext } from '@/server/auth/userOnWorkspaceContext'
import { prismaAsTrx } from '@/server/lib/prismaAsTrx'
import { PermissionsVerifier } from '@/server/permissions/PermissionsVerifier'
import {
  type PrismaClientOrTrxClient,
  type PrismaTrxClient,
} from '@/shared/globalTypes'
import { PermissionAction } from '@/shared/permissions/permissionDefinitions'
import { scopeAppByWorkspace } from '../appUtils'

interface AppDeleteServiceInputProps {
  appId: string
}

export const appDeleteService = async (
  prisma: PrismaClientOrTrxClient,
  uowContext: UserOnWorkspaceContext,
  input: AppDeleteServiceInputProps,
) => {
  return await prismaAsTrx(prisma, async (prisma: PrismaTrxClient) => {
    const { userId, workspaceId } = uowContext
    const { appId } = input

    await new PermissionsVerifier(prisma).passOrThrowTrpcError(
      PermissionAction.Delete,
      userId,
      appId,
    )

    await prisma.app.findFirstOrThrow({
      where: scopeAppByWorkspace(
        {
          id: appId,
          isDefault: false, // Keep this to avoid deleting the default app.
        },
        workspaceId,
      ),
    })

    return await prisma.app.delete({
      where: {
        id: appId,
      },
    })
  })
}

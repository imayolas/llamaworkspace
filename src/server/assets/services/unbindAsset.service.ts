import type { UserOnWorkspaceContext } from '@/server/auth/userOnWorkspaceContext'
import { prismaAsTrx } from '@/server/lib/prismaAsTrx'
import { PermissionsVerifier } from '@/server/permissions/PermissionsVerifier'
import type { PrismaClientOrTrxClient } from '@/shared/globalTypes'
import { PermissionAction } from '@/shared/permissions/permissionDefinitions'
import { scopeAssetByWorkspace } from '../assetUtils'
import { unbindAssetQueue } from '../queues/unbindAssetQueue'

interface BindAssetPayload {
  assetId: string
  appId: string
}

export const unbindAssetService = async (
  prisma: PrismaClientOrTrxClient,
  uowContext: UserOnWorkspaceContext,
  payload: BindAssetPayload,
) => {
  const { workspaceId, userId } = uowContext
  const { assetId, appId } = payload

  return await prismaAsTrx(prisma, async (prisma) => {
    await new PermissionsVerifier(prisma).passOrThrowTrpcError(
      PermissionAction.Update,
      userId,
      appId,
    )

    await prisma.asset.findFirstOrThrow({
      where: scopeAssetByWorkspace({ id: assetId }, workspaceId),
    })

    await prisma.assetsOnApps.updateMany({
      where: {
        assetId,
        appId,
      },
      data: {
        markAsDeletedAt: new Date(),
      },
    })

    await unbindAssetQueue.enqueue('unbindAsset', {
      userId,
      appId,
      assetId,
    })
  })
}

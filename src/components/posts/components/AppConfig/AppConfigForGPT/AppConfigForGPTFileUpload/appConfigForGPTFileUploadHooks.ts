import { useCreateFileUploadPresignedUrl } from '@/components/assets/assetsHooks'
import { useNotifyFileUploadSuccess } from '@/components/posts/postsHooks'
import { useCurrentWorkspace } from '@/components/workspaces/workspacesHooks'
import type { File as Asset } from '@prisma/client'
import { useCallback } from 'react'

export const useUploadFile = (
  onFileUploadStarted: (fileName: string, file: Asset) => void,
  onFileUploaded: (fileName: string, file: Asset) => void,
) => {
  const { mutateAsync: createFileUploadPresignedUrl } =
    useCreateFileUploadPresignedUrl()
  const { mutateAsync: notifyFileUploadSuccess } = useNotifyFileUploadSuccess()
  // To be fixed
  // const { refetch: refetchAppFiles } = useAppFiles(postId)
  const { data: workspace } = useCurrentWorkspace()

  return useCallback(
    async (file: File) => {
      if (!workspace) return

      const { presignedUrl, file: asset } = await createFileUploadPresignedUrl({
        workspaceId: workspace.id,
        fileName: file.name,
      })

      onFileUploadStarted(file.name, asset)

      const formData = new FormData()
      Object.keys(presignedUrl.fields).forEach((key) => {
        formData.append(key, presignedUrl.fields[key]!)
      })
      formData.append('file', file)

      const response = await fetch(presignedUrl.url, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        await notifyFileUploadSuccess({ appFileId: fileEntity.id })
        onFileUploaded(file.name, asset)

        await refetchAppFiles()
      } else {
        throw new Error('File upload filed')
      }
    },
    [
      refetchAppFiles,
      createFileUploadPresignedUrl,
      notifyFileUploadSuccess,
      onFileUploadStarted,
      onFileUploaded,
      workspace,
    ],
  )
}

import { useCurrentWorkspace } from '@/components/workspaces/workspacesHooks'
import { Square3Stack3DIcon } from '@heroicons/react/24/outline'
import { SidebarMainItemShell } from './SidebarMainItemShell'

export const SidebarMainExploreButton = () => {
  const { data: workspace } = useCurrentWorkspace()

  return (
    <SidebarMainItemShell
      title="See all"
      isActive={false}
      showPencil={false}
      icon={<Square3Stack3DIcon className="h-6 w-6" />}
      linkHref={`/w/${workspace?.id}/apps`}
    />
  )
}
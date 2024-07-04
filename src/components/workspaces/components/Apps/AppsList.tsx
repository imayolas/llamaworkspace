import { useCreateApp } from '@/components/apps/appsHooks'
import {
  Section,
  SectionBody,
  SectionsHeader,
  SectionsShell,
} from '@/components/ui/Section'
import { Button } from '@/components/ui/button'
import { useCurrentWorkspace } from '../../workspacesHooks'
import { AppsListTable } from './AppsListTable'

export const AppsList = () => {
  return (
    <SectionsShell>
      <SectionsHeader>Workspace Apps</SectionsHeader>
      <Section>
        <SectionBody className="space-y-4">
          <CreateAppSection />
          <AppsListTable />
        </SectionBody>
      </Section>
    </SectionsShell>
  )
}

const CreateAppSection = () => {
  const { data: workspace } = useCurrentWorkspace()
  const { mutateAsync: createApp } = useCreateApp()

  const handleCreateApp = async () => {
    if (!workspace?.id) return
    await createApp({ workspaceId: workspace.id })
  }

  return (
    <div className="flex w-full justify-end ">
      <Button onClick={() => void handleCreateApp()}>Create new app</Button>
    </div>
  )
}

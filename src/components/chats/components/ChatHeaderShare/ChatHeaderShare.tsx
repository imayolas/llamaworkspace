import type { ComponentWithPostId } from '@/components/posts/postsTypes'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ChatHeaderShareBody } from './ChatHeaderShareBody'

export const ChatHeaderShare = ({ postId }: ComponentWithPostId) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share GPT access</DialogTitle>
          <DialogDescription>
            Invite team members to use this GPT. Note that only usage access is
            granted, and individual chats are never shared.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-3 max-h-[400px] overflow-y-auto ">
          <div className="mx-3">
            <ChatHeaderShareBody postId={postId} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
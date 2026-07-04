'use client'

import React, { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useProject from '@/hooks/use-projects'
import { toast } from 'sonner'
import { Copy, Check, UserPlus } from 'lucide-react'

const InviteButton = () => {
  const { projectId } = useProject()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // 🚀 Construct the unique invite link safely on the client side
  const inviteUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/join/${projectId}` 
    : ''

  const handleCopy = async () => {
    if (!inviteUrl) return

    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      toast.success('Invitation link copied to clipboard!')
      
      // Reset the button icon back to the copy icon after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="hover:cursor-pointer gap-1.5"
        >
          <UserPlus className="h-4 w-4" />
          Invite Members
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Members</DialogTitle>
          <DialogDescription>
            Anyone with this secure token link will be granted collaborator access to inspect and query this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 pt-2">
          <div className="grid flex-1 gap-2">
            <Input
              id="link"
              defaultValue={inviteUrl}
              readOnly
              className="bg-slate-950/40 border-slate-800 text-muted-foreground select-all text-xs"
            />
          </div>
          
          <Button 
            type="button" 
            size="sm" 
            variant="secondary"
            onClick={handleCopy}
            className="hover:cursor-pointer hover:bg-gray-700 px-3 shrink-0 gap-1 border border-border/40"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 animate-in zoom-in-50 duration-200" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteButton
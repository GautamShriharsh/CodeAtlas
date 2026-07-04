'use client'
import { Button } from '@/components/ui/button'
import useRefetch from '@/hooks/use-Refetch'
import { api } from '@/trpc/react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const ArchiveButton = ({projectId} : {projectId : string}) => {
  
  const [open, setOpen] = useState(false)
  const archiveProject = api.project.archiveProject.useMutation();

  const refetch = useRefetch();

  const handleArchive = () => {
    archiveProject.mutate(
      { projectId },
      {
        onSuccess: () => {
          toast.success('Project archived successfully')
          refetch()
          setOpen(false) // Close the dialog upon success
        },
        onError: () => {
          toast.error('Failed to archive project')
        },
      }
    )
  }

  return (
   <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger element automatically hooks up accessibility and click listeners */}
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline"
          disabled={archiveProject.isPending}
          size='sm'  
          className='hover:cursor-pointer'
        >
          {archiveProject.isPending ? 'Archiving...' : 'Archive'}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will archive the project. You can still restore it later from your archived projects settings, but it will be hidden from your main dashboard active views.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault() // Prevents automatic closure so we can manage it with state post-mutation
              handleArchive()
            }}
            disabled={archiveProject.isPending}
            variant='destructive'
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:cursor-pointer"
          >
            {archiveProject.isPending ? 'Archiving...' : 'Archive'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ArchiveButton

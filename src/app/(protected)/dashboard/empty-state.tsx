'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { FolderPlus, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface EmptyStateProps {
  // If your create project action is a modal, pass an onClick handler. 
  // If it's a separate page, we can use a link.
  onCreateClick?: () => void 
}

const EmptyState = ({ onCreateClick }: EmptyStateProps) => {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center rounded-xl p-8 text-center animate-in fade-in-50 duration-300">
      {/* Visual Anchor */}
      <div className="flex h-12 w-12 items-center justify-center rounded-lg b">
        {/* <FolderPlus className="h-6 w-6" /> */}
        <Image src="/chip1.svg" alt="Logo" width={50} height={50} />
      </div>

      {/* Messaging */}
      <h3 className="mt-4 text-3xl font-semibold text-foreground">
        Welcome to CodeAtlas
      </h3>
      <p className="mt-2 max-w-lg text-md text-muted-foreground">
        You haven&apos;t connected any repositories yet. Index your first GitHub project to analyze architecture patterns, trace schemas, and summarize sync logs.
      </p>

      {/* Call to Action */}
      <div className="mt-6">
        
          <Link href="/create">
            <Button className="group hover:cursor-pointer bg-gray-500/20 hover:bg-gray-500/30 text-white gap-1.5">
              Create Your First Project
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        
      </div>
    </div>
  )
}

export default EmptyState
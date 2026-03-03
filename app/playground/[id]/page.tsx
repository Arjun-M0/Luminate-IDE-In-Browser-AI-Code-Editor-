"use client";

import React from 'react'   
import { useParams } from 'next/navigation';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from 'react-resizable-panels';
import { TooltipProvider } from '@/components/ui/tooltip';

const Page = () => {
  const {id} = useParams<{id: string}>();
  return (
    <TooltipProvider>
        <SidebarInset>
          <header className="px-4 py-2 border-b">
            <SidebarTrigger className="text-sm font-medium">
              <Separator orientation="vertical" className="mx-2 h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <span>{id}</span>
              </div>
            </SidebarTrigger>
          </header>
        </SidebarInset>
    </TooltipProvider>
  )
}

export default Page

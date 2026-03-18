"use client";

import React from 'react'   
import { useParams } from 'next/navigation';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import { usePlayground } from '@/features/playground/hooks/usePlayground';
import TemplateFileTree from '@/features/playground/components/template-file-tree';


const Page = () => {
  const {id} = useParams<{id: string}>();
  const {playgroundData, templateData, isLoading, error, saveTemplateData} = usePlayground(id);
  
  if (isLoading) return <div>Loading...</div>;
  if (!templateData) return <div>No template data found.</div>;

  console.log(templateData);
  return (
    <div>
    <TemplateFileTree data={templateData} />

    <TooltipProvider>
        <SidebarInset>
          <header className="px-4 py-2 border-b flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {playgroundData?.title || "Code Playground"}
              </span>
            </div>
          </header>
        </SidebarInset>
    </TooltipProvider>
    </div>
  )
}

export default Page

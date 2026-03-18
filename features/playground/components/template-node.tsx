import * as React from "react"
import { useState } from "react";
import { ChevronRight, File, Folder, Plus, FilePlus, FolderPlus, MoreHorizontal, Trash2, Edit3 } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"


// Using the provided interfaces
interface TemplateFile {
  filename: string
  fileExtension: string
  content: string
}

/**
 * Represents a folder in the template structure which can contain files and other folders
 */
interface TemplateFolder {
  folderName: string
  items: (TemplateFile | TemplateFolder)[]
}

// Union type for items in the file system
type TemplateItem = TemplateFile | TemplateFolder

interface TemplateNodeProps {
  item: TemplateItem
  onFileSelect?: (file: TemplateFile) => void
  selectedFile?: TemplateFile
  title?: string
  level:number;
  path?:string;
  onAddFile?: (file: TemplateFile, parentPath: string) => void
  onAddFolder?: (folder: TemplateFolder, parentPath: string) => void
  onDeleteFile?: (file: TemplateFile, parentPath: string) => void
  onDeleteFolder?: (folder: TemplateFolder, parentPath: string) => void
  onRenameFile?: (file: TemplateFile, newFilename: string, newExtension: string, parentPath: string) => void
  onRenameFolder?: (folder: TemplateFolder, newFolderName: string, parentPath: string) => void
}


const TemplateNode = ({
    item,
    onFileSelect,
    selectedFile,
    level,
    path = "",
    onAddFile,
    onAddFolder,
    onDeleteFile,
    onDeleteFolder,
    onRenameFile,
    onRenameFolder,
}: TemplateNodeProps) => {
    const isValidItem = item && typeof item === "object";
    const isFolder = isValidItem && "folderName" in item;

    const [isOpen , setIsOpen] = useState(level<2);

    if(!isValidItem) return null;

    if(!isFolder){
        const file = item as TemplateFile;
        const fileName = `${file.filename}.${file.fileExtension}`;
        const currentPath = path || "";

        return(
            <SidebarMenuItem
                onClick={() => onFileSelect?.(file)}
                style={{ paddingLeft: `${level * 1.5}rem` }}
                className="flex items-center justify-between group"
            >
                <div className="flex items-center">
                    <File className="h-4 w-4 mr-2 shrink-0" />
                    <span>{fileName}</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onRenameFile?.(file, file.filename, file.fileExtension, currentPath)}>
                            <Edit3 className="h-4 w-4 mr-2" />Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteFile?.(file, currentPath)}>
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        )
    }
    else{
        const folder = item as TemplateFolder;
        const folderName = folder.folderName;
        const currentPath = path ? `${path}/${folderName}` : folderName;
        return(
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuItem 
                        style={{ paddingLeft: `${level * 1.5}rem` }}
                        className="flex items-center justify-between w-full"
                    >
                        <div className="flex items-center">
                            <ChevronRight className={`h-4 w-4 mr-2 transition-transform ${isOpen ? 'transform rotate-90' : ''}`} />
                            <Folder className="h-4 w-4 mr-2 shrink-0" />
                            <span>{folderName}</span>
                        </div>
                    </SidebarMenuItem>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {folder.items.map((child, index) => (
                        <TemplateNode
                            key={index}
                            item={child}
                            level={level + 1}
                            path={currentPath}
                            onFileSelect={onFileSelect}
                            selectedFile={selectedFile}
                            onAddFile={onAddFile}
                            onAddFolder={onAddFolder}
                            onDeleteFile={onDeleteFile}
                            onDeleteFolder={onDeleteFolder}
                            onRenameFile={onRenameFile}
                            onRenameFolder={onRenameFolder}
                        />
                    ))}
                </CollapsibleContent>
            </Collapsible>
        )
    }

}

export default TemplateNode

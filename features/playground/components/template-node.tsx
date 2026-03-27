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
import { set } from "date-fns";
import { se } from "date-fns/locale";
import { NewFileDialog, NewFolderDialog, RenameFileDialog, RenameFolderDialog } from "./template-file-tree";


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
    const [isNewFileDialogOpen, setIsNewFileDialogOpen] = React.useState(false);
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = React.useState(false);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    if(!isValidItem) return null;

    if(!isFolder){
        const file = item as TemplateFile;
        const fileName = `${file.filename}.${file.fileExtension}`;
        const currentPath = path || "";
        const isSelected = selectedFile && file.filename === selectedFile.filename && file.fileExtension === selectedFile.fileExtension;
        const handelRename = ()=>{
            setIsRenameDialogOpen(true);
        }
        const handelDelete = ()=>{
            setIsDeleteDialogOpen(true);
        }
        const confirmDelete = ()=>{
            onDeleteFile?.(file, currentPath);
            setIsDeleteDialogOpen(false);
        }
        const handleRenameSubmit = (newFilename: string, newExtension: string)=>{
            onRenameFile?.(file, newFilename, newExtension, currentPath);
            setIsRenameDialogOpen(false);
        }

        return(
            <>
            <SidebarMenuItem
                onClick={() => onFileSelect?.(file)}
                style={{ paddingLeft: `${level * 1.5}rem` }}
                className={`group flex cursor-pointer items-center justify-between rounded-md transition-colors ${
                    isSelected
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/60"
                }`}
            >
                <div className="flex items-center">
                    <File className="h-4 w-4 mr-2 shrink-0" />
                    <span>{fileName}</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant={"ghost"} size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handelRename}>
                            <Edit3 className="h-4 w-4 mr-2" />Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handelDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>

            <RenameFileDialog
                isOpen={isRenameDialogOpen}
                onClose={() => setIsRenameDialogOpen(false)}
                onRenameFile={handleRenameSubmit}
                currentFilename={file.filename}
                currentExtension={file.fileExtension}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{fileName}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </>
        )
    }
    else{
        const folder = item as TemplateFolder;
        const folderName = folder.folderName;
        const currentPath = path ? `${path}/${folderName}` : folderName;

        const handleAddFile = ()=>{
            setIsNewFileDialogOpen(true);
        }
        const handleAddFolder = ()=>{
            setIsNewFolderDialogOpen(true);
        }
        const handleDelete = ()=>{
            setIsDeleteDialogOpen(true);
        }
        const confirmDelete = ()=>{
            onDeleteFolder?.(folder, path);
            setIsDeleteDialogOpen(false);
        }
        const handleRename = ()=>{
            setIsRenameDialogOpen(true);
        }
        const handleCreateFile=(filename:string , extension:string)=>{
            if(onAddFile){
                const newFile: TemplateFile = {
                    filename,
                    fileExtension: extension,
                    content: "",
                }
                onAddFile(newFile, currentPath);
            }
            setIsNewFileDialogOpen(false);
        }

        const handleCreateFolder=(folderName:string)=>{
            if(onAddFolder){
                const newFolder: TemplateFolder = {
                    folderName,
                    items: [],
                }
                onAddFolder(newFolder, currentPath);
            }
            setIsNewFolderDialogOpen(false);
        }

        const handleRenameSubmit = (newFolderName: string)=>{
            onRenameFolder?.(folder, newFolderName, path);
            setIsRenameDialogOpen(false);
        }

        return(
            <>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <SidebarMenuItem 
                    style={{ paddingLeft: `${level * 1.5}rem` }}
                    className="flex items-center justify-between w-full group"
                >
                    <CollapsibleTrigger asChild>
                        <div className="flex items-center flex-grow cursor-pointer">
                            <ChevronRight className={`h-4 w-4 mr-2 transition-transform ${isOpen ? 'transform rotate-90' : ''}`} />
                            <Folder className="h-4 w-4 mr-2 shrink-0" />
                            <span>{folderName}</span>
                        </div>
                    </CollapsibleTrigger>
                    {/* Level requirement removed so folders on top-level of file tree show settings 3-dots */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant={"ghost"} size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleAddFile}>
                                <FilePlus className="h-4 w-4 mr-2" />Add File
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleAddFolder}>
                                <FolderPlus className="h-4 w-4 mr-2" />Add Folder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleRename}>
                                <Edit3 className="h-4 w-4 mr-2" />Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
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

            <NewFileDialog
                isOpen={isNewFileDialogOpen}
                onClose={() => setIsNewFileDialogOpen(false)}
                onCreateFile={handleCreateFile}
            />

            <NewFolderDialog
                isOpen={isNewFolderDialogOpen}
                onClose={() => setIsNewFolderDialogOpen(false)}
                onCreateFolder={handleCreateFolder}
            />  

            <RenameFolderDialog
                isOpen={isRenameDialogOpen}
                onClose={() => setIsRenameDialogOpen(false)}
                onRenameFolder={handleRenameSubmit}
                currentFolderName={folderName}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{folderName}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            </>
        )
    }

}

export default TemplateNode

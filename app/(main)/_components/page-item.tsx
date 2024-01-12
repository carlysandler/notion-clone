"use client"
import {
	LucideIcon,
	ChevronDown,
	ChevronRight,
	Plus,
	MoreHorizontal,
	Trash
} from "lucide-react"

import React from "react";
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils";

import {
	Skeleton
} from "@/components/ui/skeleton"
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation"
import { toast } from "sonner";
import { 
	DropdownMenu, 
	DropdownMenuContent, 
	DropdownMenuSeparator, 
	DropdownMenuTrigger, 
	DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/clerk-react";



interface ItemProps {
	id?: Id<"documents">;
	documentIcon?: string;
	active?: boolean;
	level?: number;
	expanded?: boolean;
	isSearch?: boolean;
	onExpand?: () => void;
	label: string;
	icon: LucideIcon;
	onClick?: () =>  void;
}

export const PageItem = ({
	id,
	documentIcon,
	active,
	level = 0,
	expanded,
	isSearch,
	onExpand,
	label,
	icon: Icon,
	onClick
}: ItemProps) => {
	const { user } = useUser()
	const router = useRouter()
	const createDocument = useMutation(api.documents.create)
	const archiveDocuument = useMutation(api.documents.archive)
	
	const ChevronIcon = expanded ? ChevronDown : ChevronRight
	// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent
	const isMac = navigator.userAgent.indexOf("Mac") !== -1

	const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.stopPropagation()
		onExpand?.()
	}

	const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.stopPropagation()
		if (!id) return
		const promise = createDocument({ title: "Untitled", parentDocument: id })
			.then((documentId:string) => {
				if (!expanded) {
					onExpand?.()
				}
				router.push(`/documents/${documentId}`)
			})
		toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
	}

	const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.stopPropagation()
		if (!id) return
		const promise = archiveDocuument({ id })
			.then(() => router.push("/documents"))
		
		toast.promise(promise, {
			loading: "Archiving note...",
			success: "Note moved to trash!",
			error: "Failed to archive note."
		})
	}

	return (
		<div
			onClick={onClick}
			role="button"
			style={{ paddingLeft: level ? `${(level * 12) + 12}px` : "12px" }}
			className={cn(
				"group min-h-[27px] text-sm text-muted-foreground flex items-center font-medium py-1 pr-3 hover:bg-primary/5",
				active && "bg:primary/5 text-primary"
				)}
		>
			{!!id && (
				<div
					onClick={handleExpand}
					role="button"
					className="h-full rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-600 mr-1"
				>
					<ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
				</div>
			)}
			{documentIcon ? (
				<div className="shrink-0 mr-2 text-[18px]">
					{documentIcon}
				</div>
			) : (
				<Icon  className="h-[18px] text-muted-foreground mr-2 shrink-0"/>
			)}
			<span className="truncate">
				{label}
			</span>
			{
				isSearch && (
					// TODO: come back and test if font-mono and opaccity are necessary
					<kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
						<span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
					</kbd>
				)
			}
		{!!id && (
			<div className="flex items-center gap-x-2 ml-auto">
				<DropdownMenu>
					<DropdownMenuTrigger
						onClick={(e) =>  e.stopPropagation()}
						asChild
					>
						<div
							role="button"
							className="opacity-0 group-hover:opacity-100 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
						>
							<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-60"
						side="right"
						align="start"
						forceMount
					>
						<DropdownMenuItem onClick={onArchive}>
							<Trash className="h-4 w-4 mr-2"/>
							Delete
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<p className="text-xs text-muted-foreground p-2">
							Last edited by: {user?.fullName}
						</p>
					</DropdownMenuContent>
				</DropdownMenu>
				<div
					role="button"
					onClick={onCreate}
					className="opacity-0 group-hover:opacity-100 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
				>
					<Plus className="h-4 w-4 text-muted-foreground"/>
				</div>
			</div>

		)}
		</div>
	)
}

PageItem.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
	return (
		<div
			style={{ paddingLeft: level ? `${(level * 12) + 25}px` : "12px" }}
			className="flex gap-x-2 py-[3px]"
		>
			<Skeleton  className="h-4 w-4"/>
			<Skeleton className="h-4 w-[30%]"/>

		</div>
	)


}
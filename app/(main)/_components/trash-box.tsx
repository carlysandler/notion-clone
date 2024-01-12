"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import {
	Search,
	Trash,
	Undo
} from "lucide-react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Spinner } from "@/components/spinner"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Input } from "@/components/ui/input"
import { 
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/components/ui/tooltip"


export const TrashBox = () => {
	const router = useRouter()
	const params = useParams()
	const pathName = usePathname()
	const documents = useQuery(api.documents.getTrash)
	const restoreDocument = useMutation(api.documents.restore)
	const removeDocument = useMutation(api.documents.remove) 

	const [search, setSearch] = useState<string>("")

	const filteredDocuments = useMemo(() => {
		return search ? documents?.filter?.((doc) => doc.title.toLowerCase().includes(search.toLowerCase().trim())) : documents
	}, [search, documents])

	const onClick = (documentId: Id<"documents">) => {
		console.log(pathName)
		router.push(`/documents/${documentId}`)
	}

	const onRestore = (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		documentId: Id<"documents">
	) => {
		event.stopPropagation()
		const promise = restoreDocument({ id: documentId })

		toast.promise(promise, {
			loading: "Restoring note...",
			success: "Note restored!",
			error: "Failed to restore note."
		})
	}

	const onRemove = (
		documentId: Id<"documents">
	) => {
		const promise = removeDocument({ id: documentId })

		toast.promise(promise, {
			loading: "Deleting note...",
			success: "Note deleted!",
			error: "Failed to delete note."
		})

		if (params.documentId === documentId) {
			router.push("/documents")
		}
	}

	if (documents === undefined) {
		return (
			<div className="h-full flex items-center justify-center p-4">
				<Spinner size="lg"/>
			</div>
		)
	}

	return (
		<div className="text-sm">
			<div className="flex items-center space-x-1 p-2">
				<Search className="h-4 w-4 text-muted-foreground"/>
				<Input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Filter by page title"
					className="h-7 px-2 bg-secondary focus-visible:ring-transparent"
				/>
			</div>
			<div className="mt-2 px-1 pb-1">
				<p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
					No documents found.
				</p>
				{filteredDocuments?.map?.((doc) => (
					<div
						key={doc._id}
						id={doc._id}
						role="button"
						onClick={() => onClick(doc._id)}
						className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center justify-between text-primary"
					>
						<span className="truncate pl-2">
							{doc.title}
						</span>
						<div className="flex items-center">
							<TooltipProvider delayDuration={300}>
								<Tooltip>
									<TooltipTrigger asChild>
										<div
											role="button"
											onClick={(e) => onRestore(e, doc._id)}
											className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
										>
											<Undo className="h-4 w-4 text-muted-foreground"/>
										</div>
									</TooltipTrigger>
									<TooltipContent side="top" className="cursor-default select-none" onClick={(e) => { e.stopPropagation(); e.preventDefault() }}>
										<span className="truncate text-xs">Restore</span>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<ConfirmModal 
								onConfirm={() => onRemove(doc._id)}
								action="delete"
								>
								<div
									role="button"
									className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
								>
									<Trash className="h-4 w-4 text-muted-foreground"/>
								</div>
							</ConfirmModal>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

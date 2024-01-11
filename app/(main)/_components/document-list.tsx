"use client"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { PageItem } from "./page-item";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
	parentDocumentId?: Id<"documents">
	level?: number;
	data?: Doc<"documents">
}
export const DocumentList = ({
	parentDocumentId,
	level = 0,
	data
}: DocumentListProps) => {
	const params = useParams()
	console.log("next navigation params", params)
	const router = useRouter()
	console.log("next navigation router", router)
	const [expanded, setExpanded] = useState<Record<string, boolean>>({})

	const onExpand = (documentId: string) => {
		setExpanded((prevExpanded: { [x: string]: boolean; }) => ({
			...prevExpanded,
			[documentId]: !prevExpanded[documentId]
		}))
	}
	const documents = useQuery(api.documents.getSidebar, { parentDocument: parentDocumentId })

	const onRedirect = (documentId: string) => {
		router.push(`/documents/${documentId}`)
	}
	if (documents === undefined) {
		return (
			<>
				<PageItem.Skeleton level={level} />
				<PageItem.Skeleton level={level} />
			</>
		)
	}

	return (
		<>
			<p
				style={{ paddingLeft: level ? `${(level * 12) + 25}px` : undefined }}
				className={cn(
					"hidden text-sm font-medium text-muted-foreground/80",
					expanded && "last:block",
					level === 0 && "hidden"
				)}
			>
				No pages inside
			</p>
			{documents?.map((document) => (
				<div key={document._id}>
					<PageItem
						icon={FileIcon}
						id={document._id}
						onClick={() => onRedirect(document._id)}
						label={document.title}
						documentIcon={document.icon}
						active={params.documentId === document._id}
						level={level}
						onExpand={() => onExpand(document._id)}
						expanded={expanded[document._id]}
					/>
					{expanded[document._id] && (
						<DocumentList
							parentDocumentId={document._id}
							level={level + 1}
						/>
					)}
				</div>
			))}
		</>
	)

}
"use client"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface BannerProps {
	documentId: Id<"documents">
}

export const Banner = ({
	documentId
}: BannerProps) => {

	const router = useRouter()
	const removeDocument = useMutation(api.documents.remove)
	const restoreDocument = useMutation(api.documents.restore)

	const onRemove = () => {
		const promise = removeDocument({ id: documentId })

		toast.promise(promise, {
			loading: "Deleting note...",
			success: "Note delete!",
			error: "Failed to delete note."
		})

		router.push("/documents")
	}

	const onRestore = () => {
		const promise = restoreDocument({ id: documentId})

		toast.promise(promise, {
			loading: "Restoring note...",
			success: "Note restored!",
			error: "Failed to restore note."
		})
	}


	return (
		<div
			className="w-full bg-rose-500 flex items-center text-white text-center text-sm justify-center p-2 space-x-2"
		>
			<p className="uppercase">
				This page is archived
			</p>
			<Button
				variant="outline"
				size="sm"
				onClick={onRestore}
				className="border-white bg-transparent hover:bg-primary/5 hover:text-white p-1 px-2 h-auto font-normal"
			>
				Restore
			</Button>
			<ConfirmModal onConfirm={onRemove} action="delete">
				<Button
					variant="outline"
					size="sm"
					className="border-white bg-transparent hover:bg-primary/5 hover:text-white p-1 px-2 h-auto font-normal"
				>
					Delete
				</Button>
			</ConfirmModal>
		</div>
	)
}

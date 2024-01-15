"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { EdgeStoreApiClientError } from "@edgestore/react/shared"
import { formatFileSize } from "@edgestore/react/utils"
import { SingleImageDropzone } from "@/components/single-image-dropzone"
import { useEdgeStore } from "@/lib/edgestore"
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { toggle } from "@/lib/features/cover-image/coverImageSlice"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

export const CoverImageModal = () => {
  const params = useParams()
  const updateDocument = useMutation(api.documents.update)
  const dispatch = useAppDispatch()
  const coverImage = useAppSelector((state) => state.coverImage)

  const { edgestore } = useEdgeStore()

  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    dispatch(toggle(false))
  }

  const onChange = async (file?: File) => {
    try {
      if (file) {
        setIsSubmitting(true)
        setFile(file)

        const res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl: coverImage.url,
          },
        })

        if (res.url) {
          updateDocument({
            id: params.documentId as Id<"documents">,
            coverImage: res.url,
          })
        }
      }
      onClose()
    } catch (err) {
      // All errors are typed and you will get intellisense for them
      if (err instanceof EdgeStoreApiClientError) {
        // if it fails due to the `maxSize` set in the router config
        if (err.data.code === "FILE_TOO_LARGE") {
          alert(
            `File too large. Max size is ${formatFileSize(
              err.data.details.maxFileSize
            )}`
          )
        }
        // if it fails due to the `accept` set in the router config
        if (err.data.code === "MIME_TYPE_NOT_ALLOWED") {
          alert(
            `File type not allowed. Allowed types are ${err.data.details.allowedMimeTypes.join(
              ", "
            )}`
          )
        }
        // if it fails during the `beforeUpload` check
        if (err.data.code === "UPLOAD_NOT_ALLOWED") {
          alert("You don't have permission to upload files here.")
        }
      }
    }
  }

  return (
    <Dialog
      open={coverImage.isOpen}
      onOpenChange={() => dispatch(toggle(false))}
    >
      <DialogContent>
        <DialogHeader>
          <h2 className="text-lg text-center font-semibold">
            Cover Image
          </h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full ourline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  )
}

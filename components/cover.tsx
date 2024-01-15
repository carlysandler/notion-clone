"use client"

import Image from "next/image"
import { ImageIcon, X } from "lucide-react"
import { useMutation } from "convex/react"
import { useParams } from "next/navigation"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useEdgeStore } from "@/lib/edgestore"
import { useAppDispatch } from "@/lib/hooks"
import { replace } from "@/lib/features/cover-image/coverImageSlice"

interface CoverImageProps {
  url?: string
  preview?: boolean
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const { edgestore } = useEdgeStore()
  const params = useParams()
  const dispatch = useAppDispatch()
  const removeCoverImage = useMutation(api.documents.update)

  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url,
      })
    }
    removeCoverImage({
      id: params.documentId as Id<"documents">,
    })
  }

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && (
        <Image
          src={url}
          fill
          alt="Cover Image"
          className="object-cover"
        />
      )}
      {url && !preview && (
        <div className="absolute opacity-0 group-hover:opacity-100 bottom-5 right-5 flex items-center space-x-2">
          <Button
            onClick={() => dispatch(replace(url))}
            variant="outline"
            size="sm"
            className="text-muted-foreground text-xs"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            variant="outline"
            size="sm"
            className="text-muted-foreground text-xs"
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[12vh]" />
}

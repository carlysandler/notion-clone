"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { toast } from "sonner"
import { Check, Copy, Globe } from "lucide-react"

import { Doc } from "@/convex/_generated/dataModel"
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover"
import { useOrigin } from "@/hooks/use-origin"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"

interface PublishProps {
  initialData: Doc<"documents">
}

export const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin()
  const updateDocument = useMutation(api.documents.update)

  const [copied, setCopied] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const url = `${origin}/preview/${initialData._id}`

  const onPublishOrUnPublish = (publish: boolean) => {
    setIsSubmitting(true)
    const toastConfig = {
      loading: publish ? "Publishing..." : "Unpublishing...",
      success: `Note ${publish ? "published" : "unpublished"}.`,
      error: `Failed to ${publish ? "publish" : "unpublish"} note.`,
    }
    const promise = updateDocument({
      id: initialData._id,
      isPublished: publish,
    }).then(() => setIsSubmitting(false))

    toast.promise(promise, { ...toastConfig })
  }

  const onCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 300)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="text-primary ">
          Publish
          {initialData.isPublished && (
            <Globe className="w-4 h-4 ml-2 text-sky-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72"
        align="end"
        alignOffset={8}
        forceMount
      >
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Globe className="text-sky-500 w-4 h-4 animate-pulse" />
              <p className="text-xs text-sky-500 font-medium">
                Document is live.
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 text-xs border h-8 rounded-l-sm px-2 bg-muted truncate"
                disabled
                value={url}
              />
              <Button
                className="rounded-l-none h-8"
                disabled={copied}
                onClick={onCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={() => onPublishOrUnPublish(false)}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-4 w-4 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">
              Publish this document.
            </p>
            <span className="mb-4 text-xs text-muted-foreground">
              Share your work with others.
            </span>
            <Button
              className="w-full text-xs"
              size="sm"
              disabled={isSubmitting}
              onClick={() => onPublishOrUnPublish(true)}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

"use client"

import { useMutation, useQuery } from "convex/react"
import { useMemo } from "react"

import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"

import { Toolbar } from "@/components/toolbar"
import { Cover } from "@/components/cover"
import { Skeleton } from "@/components/ui/skeleton"

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">
  }
}

const DocucmentIdPage = ({ params }: DocumentIdPageProps) => {
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  })

  if (document === null) {
    return <div>Not found</div>
  }

  if (document === undefined) {
    return (
      <div>
        <div className="h-20" />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8  pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="pb-40">
      <Cover
        url={document.coverImage}
        preview={document.isPublished}
      />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
      </div>
    </div>
  )
}

export default DocucmentIdPage

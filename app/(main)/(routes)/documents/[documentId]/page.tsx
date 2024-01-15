"use client"

import { useMutation, useQuery } from "convex/react"
import dynamic from "next/dynamic"
import { useMemo } from "react"

import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"

import { Toolbar } from "@/components/toolbar"
import { Cover } from "@/components/cover"
import { Skeleton } from "@/components/ui/skeleton"
import { useEdgeStore } from "@/lib/edgestore"

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">
  }
}

const DocucmentIdPage = ({ params }: DocumentIdPageProps) => {
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  })

  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  )
  const { edgestore } = useEdgeStore()
  const updateDocument = useMutation(api.documents.update)

  /**
   * 
   * Compare the document object content with the updated content string onChange
   * If an image exists in the document but not in the updated content, the user has removed the image block
   * We can extract the url  from the document.content (assuming it hasnt been updated yet), and call the edgestore delete api to avoid inundating our db with files that are not used 
   * {
    "id": "455e0bce-53d5-423c-a41b-3a6a21eeb2f6",
    "type": "image",
    "props": {
      "backgroundColor": "default",
      "textAlignment": "left",
      "url": "https://files.edgestore.dev/eaehn9srm1xfh4fd/publicFiles/_public/4f8bc9a5-299e-4f7b-8e4e-48f4a35b83dd.png",
      "caption": "",
      "width": 512
    },
    "children": []
  },
   */

  const handleDeleteImg = async (url: string) => {
    await edgestore.publicFiles.delete({ url })
  }

  const parseAndExtractImageContent = (
    content: string | undefined,
    idOnly: boolean
  ) => {
    if (content === undefined) {
      return []
    }
    const parsed = JSON.parse(content)
    const images = parsed.filter(
      (content: { type: string }) => content.type === "image"
    )
    return idOnly
      ? images.map((img: { id: string }) => img.id)
      : images.map((img: { id: string; props: { url: string } }) => {
          return { id: img.id, url: img.props.url }
        })
  }

  const documentContentImagesById = useMemo(() => {
    const imagesById: { [key: string]: { id: string; url: string } } =
      {}
    const images = parseAndExtractImageContent(
      document?.content,
      false
    )
    images.forEach((img: { id: string; url: string }) => {
      imagesById[img.id] = img
    })
    return imagesById
  }, [document?.content])

  const onChange = async (content: string) => {
    const updatedImageIds = parseAndExtractImageContent(content, true)
    const imageIds = Object.keys(documentContentImagesById)
    for (let i = 0; i < imageIds.length; i++) {
      // if the original imgId doesn't exist in the updated content, delete the imgage from edgestore
      if (!updatedImageIds.includes(imageIds[i])) {
        await handleDeleteImg(
          documentContentImagesById[imageIds[i]].url
        )
      }
    }
    updateDocument({
      id: params.documentId,
      content,
    })
  }

  if (document === null) {
    return <div>Not found</div>
  }

  if (document === undefined) {
    return (
      <div>
        <div className="h-20" />
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
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
        <Editor
          onChange={onChange}
          initialContent={document.content}
        />
      </div>
    </div>
  )
}

export default DocucmentIdPage

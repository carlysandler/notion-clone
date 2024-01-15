"use client"

import { useTheme } from "next-themes"
import { BlockNoteEditor, PartialBlock } from "@blocknote/core"
import { BlockNoteView, useBlockNote } from "@blocknote/react"
import "@blocknote/react/style.css"

import { useEdgeStore } from "@/lib/edgestore"

interface EditorProps {
  onChange: (value: string) => void
  initialContent?: string
  editable?: boolean
}

const Editor = ({
  onChange,
  initialContent,
  editable = true,
}: EditorProps) => {
  const { resolvedTheme } = useTheme()
  const { edgestore } = useEdgeStore()

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({
      file,
    })

    return res.url
  }

  // TODO: What if i delete a block image. I should delete it from my edgestore...
  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent
      ? JSON.parse(initialContent)
      : undefined,
    onEditorContentChange: (editor: BlockNoteEditor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
    },
    uploadFile: handleUpload,
  })

  return (
    <>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </>
  )
}

export default Editor

"use client"

import { ElementRef, useRef, useState } from "react"
import { ImageIcon, Smile, X } from "lucide-react"
import { useMutation } from "convex/react"
import TextareaAutoResize from "react-textarea-autosize"

import { Doc } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"

import { Button } from "@/components/ui/button"
import { IconPicker } from "@/components/icon-picker"
import { useAppDispatch } from "@/lib/hooks"
import { toggle } from "@/lib/features/cover-image/coverImageSlice"

interface ToolbarProps {
  initialData: Doc<"documents">
  preview?: boolean
}

export const Toolbar = ({
  initialData,
  preview = false,
}: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState<string>(initialData.title)

	const dispatch = useAppDispatch()

  const updateDocument = useMutation(api.documents.update)

  const enableInput = () => {
    if (preview) return

    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData.title)
      inputRef.current?.focus()
    }, 0)
  }

  const disableInput = () => setIsEditing(false)

  const onInput = (value: string) => {
    setValue(value)
    updateDocument({
      id: initialData._id,
      title: value || "Untitled",
    })
  }

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault()
    disableInput()
  }

  const onIconSelect = (icon: string) => {
    updateDocument({
      id: initialData._id,
      icon,
    })
  }

	const onRemoveIcon = () => {
		updateDocument({
			id: initialData._id,
			icon: ""
		})
	}

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center group/icon space-x-2 pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
						variant="outline"
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
						size="icon"
          >
            <X className="h-4-w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={() => dispatch(toggle(true))}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutoResize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none break-words"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  )
}

"use client"

import { KeyboardEvent, useEffect, useState } from "react"
import { File } from "lucide-react"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { api } from "@/convex/_generated/api"
import { toggle } from "@/lib/features/dialog/searchDialogSlice"

export const SearchCommand = () => {
  const { user } = useUser()
  const router = useRouter()
  const documents = useQuery(api.documents.getSearch)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const isOpen = useAppSelector((state) => state.search.isOpen)

  useEffect(() => {
    // Prevent hydration errors with dialog for server-side rendering
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const down = (ev: KeyboardEvent) => {
      if (ev.key === "k" && (ev.metaKey || ev.ctrlKey)) {
        ev.preventDefault()
        dispatch(toggle(!isOpen))
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [dispatch, isOpen])

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`)
    dispatch(toggle(false))
  }

  if (!isMounted) return null

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={() => dispatch(toggle(false))}
    >
      <CommandInput
        placeholder={`Search ${user?.fullName}'s Scribble`}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((doc) => (
            <CommandItem
              key={doc._id}
              value={`${doc._id}-${doc.title}`}
              title={doc.title}
              onSelect={onSelect}
            >
              {doc.icon ? (
                <p className="mr-2 text-[18px]">{doc.icon}</p>
              ) : (
                <File className="mr-2 w-4 h-4" />
              )}
              <span>{doc.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

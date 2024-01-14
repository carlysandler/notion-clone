"use client"
import { 
  ChevronsLeft, 
  MenuIcon, 
  Plus, 
  PlusCircle, 
  Search, 
  Settings,
  Trash
} from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { ElementRef, useEffect, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { cn } from "@/lib/utils"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useAppDispatch } from "@/lib/hooks"
import { toggle as toggleSearch } from "@/lib/features/dialog/searchDialogSlice"
import { toggle as toggleSettings } from "@/lib/features/dialog/settingsDialogSlice"

// components
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover"
import { UserItem, PageItem, DocumentList, TrashBox, Navbar } from "./index"
import { toast } from "sonner"


export const Navigation = () => {
  const params = useParams()
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<"aside">>(null)
  const navbarRef = useRef<ElementRef<"div">>(null)
  const [isResetting, setIsResetting] = useState<boolean>(false)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isMobile)

  const router = useRouter()
  const createDocument = useMutation(api.documents.create)

  const handleCreate = () => {
    const promise = createDocument({ title: "Untitled" }).then((documentId) => router.push(`/documents/${documentId}`))
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    })
  }

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])

  // EVENT LISTENERS
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault()
    event.stopPropagation()
    isResizingRef.current = true
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return
    let newWidth = event.clientX
    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty("left", `${newWidth}px`)
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% -${newWidth}px`
      )
    }
  }
  const handleMouseUp = () => {
    isResizingRef.current = false
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)

      sidebarRef.current.style.width = isMobile ? "100%" : "240px"
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      )
      navbarRef.current.style.setProperty(
        "left",
        isMobile ? "100%" : "240px"
      )

      // use setTimeout with 300ms to follow our transition time below
      setTimeout(() => setIsResetting(false), 300)
    }
  }
  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = "0"
      navbarRef.current.style.setProperty("width", "100%")
      navbarRef.current.style.setProperty("left", "0")
      // use setTimeout with 300ms to follow our transition time below
      setTimeout(() => setIsResetting(false), 300)
    }
  }
  return (
    <>
    {/* Needed to change the z-index on the aside from 99999 to 999 in order for the editor to take priority in the stacking context.
      Need to explore this issue more because directly manipulating the @BlockEditor css file like recommended did not work. 
      Or even manipulating the element style temporarily in the DOM */}
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar bg-secondary overflow-y-auto relative w-60 flex flex-col z-[999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <PageItem
            icon={Search}
            label="Search"
            isSearch
            onClick={() => dispatch(toggleSearch(true))}
          />
          <PageItem
            icon={Settings}
            label="Settings"
            onClick={() => dispatch(toggleSettings(true))}
          />
          <PageItem
            icon={PlusCircle}
            label="New page"
            onClick={handleCreate}
          />
        </div>
        <div className="mt-4">
          <DocumentList />
          <PageItem
            onClick={handleCreate}
            icon={Plus}
            label="Add a page"
          />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <PageItem
                icon={Trash}
                label="Trash"
              />
            </PopoverTrigger>
              <PopoverContent
                className="p-0 w-72"
                side={isMobile ? "bottom" : "right"}
              >
                <TrashBox />
              </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar
            onResetWidth={resetWidth}
            isCollapsed={isCollapsed}
          />
        ): (
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </nav>
        )}
      </div>
    </>
  )
}

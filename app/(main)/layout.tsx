// Protected Layout: Logged in only
"use client"
import { useConvexAuth } from "convex/react"
import { redirect } from "next/navigation"

import { Spinner } from "@/components/spinner"
import { Navigation } from "./_components"
import { SearchCommand } from "@/components/search-command"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  if (isLoading && isAuthenticated) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }
  if (!isAuthenticated) {
    return redirect("/")
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout

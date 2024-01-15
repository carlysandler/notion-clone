"use client"
import { useConvexAuth } from "convex/react"
import { SignInButton } from "@clerk/clerk-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Spinner } from "@/components/spinner"

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents & Plans. Unified. Welcome to{" "}
        <span className="underline">Scribble</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Scribble is the connected workspace where <br />
        better, faster work happens.
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isAuthenticated && !isLoading && (
        <Button asChild>
          <Link href="/documents">
            Enter Scribble
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  )
}

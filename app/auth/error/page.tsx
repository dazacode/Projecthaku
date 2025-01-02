"use client"

import { useRouter } from "next/navigation"

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Authentication Error</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          There was an error signing in. Please try again.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-8 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Go back home
        </button>
      </div>
    </div>
  )
}

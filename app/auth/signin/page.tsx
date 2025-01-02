"use client"

import { signIn } from "next-auth/react"
import { useEffect } from "react"

export default function SignInPage() {
  useEffect(() => {
    signIn("google", { callbackUrl: "/" })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecting to sign in...</h1>
      </div>
    </div>
  )
}

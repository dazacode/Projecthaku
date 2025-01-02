"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { createContext, useContext, useEffect, useState } from "react"
import { UserSubscription } from "@/types/subscription"
import { getUserSubscription, createFreeSubscription } from "@/lib/subscription"
import { supabase } from "@/lib/supabase"
import { MusicProvider } from "@/contexts/music-context"

interface SubscriptionContextType {
  subscription: UserSubscription | null
  loading: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  loading: true,
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSubscription() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          let userSub = await getUserSubscription(session.user.id)
          
          if (!userSub) {
            await createFreeSubscription(session.user.id)
            userSub = await getUserSubscription(session.user.id)
          }
          
          setSubscription(userSub)
        }
      } catch (error) {
        console.error('Error loading subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userSub = await getUserSubscription(session.user.id)
          setSubscription(userSub)
        } else if (event === 'SIGNED_OUT') {
          setSubscription(null)
        }
      }
    )

    return () => {
      authSubscription.unsubscribe()
    }
  }, [])

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="light"
      themes={["light", "dark", "ukiyo", "wabi", "edo"]}
    >
      <SessionProvider>
        <MusicProvider>
          <SubscriptionContext.Provider value={{ subscription, loading }}>
            {children}
          </SubscriptionContext.Provider>
        </MusicProvider>
      </SessionProvider>
    </NextThemesProvider>
  )
}

export const useSubscriptionContext = () => useContext(SubscriptionContext)

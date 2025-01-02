import { getServerSession } from "next-auth"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabase, supabaseAdmin } from "./supabase"
import { createFreeSubscription } from "./subscription"

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or NEXTAUTH_SECRET');
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          redirect_uri: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google` : 'http://localhost:3000/api/auth/callback/google'
        }
      }
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || !user) return false

      try {
        // Create or update user in Supabase
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: user.email!,
          email_confirmed: true,
          user_metadata: {
            full_name: user.name,
            avatar_url: user.image,
            provider: "google",
          },
        })

        if (error && error.message !== "User already registered") {
          console.error("Supabase user creation error:", error)
          return false
        }

        // Get or create subscription
        const { data: subscriptionData } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', data?.user?.id || user.id)
          .single()

        if (!subscriptionData) {
          // Create free subscription if none exists
          await createFreeSubscription(data?.user?.id || user.id)
        }

        return true
      } catch (error) {
        console.error("Error in sign in process:", error)
        return false
      }
    },
    async session({ session, token }) {
      if (session.user) {
        try {
          const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.admin.getUserById(token.sub!)
          
          if (!error && supabaseUser) {
            session.user.id = supabaseUser.id
          }
        } catch (error) {
          console.error("Error getting Supabase user:", error)
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.sub = user.id
      }
      return token
    },
  },
  events: {
    async signOut({ token }) {
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.error("Error signing out from Supabase:", error)
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const getAuthSession = () => getServerSession(authOptions)

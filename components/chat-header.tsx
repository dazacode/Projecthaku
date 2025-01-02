"use client"

import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useSubscription } from "@/hooks/useSubscription"
import { useMessageUsage } from "@/hooks/useMessageUsage"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SettingsModal } from "@/components/settings-modal"

interface ChatHeaderProps {
  isTyping?: boolean
  isOpenSettings: boolean
  setIsOpenSettings: (open: boolean) => void
  isOpenSubscription: boolean
  setIsOpenSubscription: (open: boolean) => void
  onToggleSidebar: () => void
}

export function ChatHeader({ 
  isTyping, 
  isOpenSettings, 
  setIsOpenSettings,
  isOpenSubscription,
  setIsOpenSubscription,
  onToggleSidebar
}: ChatHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const { subscription } = useSubscription()
  const { usage, remainingMessages } = useMessageUsage()

  return (
    <div className="flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
        >
          <img
            src="/haku.png"
            alt="H"
            className="h-7 w-7 rounded-full object-cover"
          />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-medium">Haku</h1>
            {isTyping && (
              <div className="flex items-center space-x-1">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/50" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/50 [animation-delay:0.2s]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/50 [animation-delay:0.4s]" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{subscription?.plan === "free" ? "Free Plan" : subscription?.plan === "pro" ? "Pro Plan" : "Max Plan"}</span>
            <span>•</span>
            <span>{remainingMessages} messages left</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsOpenSettings(true)}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
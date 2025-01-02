"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { useSession, signIn, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useSubscription } from "../hooks/useSubscription"
import { useMessageUsage } from "../hooks/useMessageUsage"
import { Progress } from "./ui/progress"
import { MusicPlayer } from "./music-player"
import { Separator } from "./ui/separator"
import { themes, type ThemeKey } from "@/lib/themes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Moon, Sun, Palette, Leaf, MoonStar } from "lucide-react"
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin"
import { Switch } from "@/components/ui/switch"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  setIsOpenSubscription: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange, setIsOpenSubscription }: SettingsModalProps) {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const { subscription, loading } = useSubscription()
  const { usage, remainingMessages, refreshCount } = useMessageUsage()
  const { isAdmin, isAdminEnabled, toggleAdmin } = useAdmin()

  useEffect(() => {
    if (open && !isAdminEnabled) {
      refreshCount();
    }
  }, [open, isAdminEnabled]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-6 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>

        {/* User Profile */}
        {session && (
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
              <AvatarFallback>
                {session.user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">
                  {session.user?.name}
                </p>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  subscription?.plan === 'pro' ? "bg-primary/10 text-primary" :
                  subscription?.plan === 'max' ? "bg-purple-500/10 text-purple-500" :
                  "bg-muted text-muted-foreground"
                )}>
                  {subscription?.plan === 'pro' ? 'Pro' :
                   subscription?.plan === 'max' ? 'Max' :
                   'Free'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {session.user?.email}
              </p>
            </div>
          </div>
        )}

        {/* Usage Stats */}
        <div 
          className="space-y-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            onOpenChange(false); 
            setIsOpenSubscription(true);
          }}
          title="Click to manage plan"
        >
          <div className="flex justify-between text-sm">
            <span>Messages Used</span>
            <span className="text-muted-foreground">
              {usage.count} / {usage.limit}
            </span>
          </div>
          <Progress 
            value={usage.percentage} 
            className="h-2"
          />
        </div>

        {/* Theme Selector */}
        <div className="flex flex-col space-y-4">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={theme}
            onValueChange={setTheme}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light (Sakura)</span>
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark (Midnight)</span>
                </div>
              </SelectItem>
              <SelectItem value="ukiyo">
                <div className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  <span>Ukiyo-e</span>
                </div>
              </SelectItem>
              <SelectItem value="wabi">
                <div className="flex items-center">
                  <Leaf className="mr-2 h-4 w-4" />
                  <span>Wabi-Sabi</span>
                </div>
              </SelectItem>
              <SelectItem value="edo">
                <div className="flex items-center">
                  <MoonStar className="mr-2 h-4 w-4" />
                  <span>Edo Night</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Admin Toggle */}
        {isAdmin && (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Admin Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable admin features for debugging
              </p>
            </div>
            <Switch
              checked={isAdminEnabled}
              onCheckedChange={toggleAdmin}
            />
          </div>
        )}

        {/* Music Player */}
        <div className="space-y-4">
          <Separator />
          <MusicPlayer />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {subscription?.status !== "active" && (
            <Button
              className="w-full"
              onClick={() => window.location.href = '/upgrade'}
            >
              Upgrade Plan
            </Button>
          )}
          
          {session ? (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => signIn("google")}
            >
              Sign in with Google
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

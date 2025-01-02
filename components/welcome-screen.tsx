"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaDiscord, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { useState } from 'react';
import { useChats } from '@/hooks/useChats';
import { ChatSidebar } from '@/components/chat-sidebar';
import { ChatInput } from '@/components/chat-input';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Settings, User } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const examples = [
  {
    text: "What is Japan?",
    mode: "Uses 'Off' mode"
  },
  {
    text: "Hello, mom.",
    mode: "Uses 'Hiragana' mode"
  },
  {
    text: "I am testing",
    mode: "Uses 'Katakana' mode"
  }
];

const socialLinks = [
  {
    name: 'Discord',
    href: '#',
    icon: FaDiscord
  },
  {
    name: 'X',
    href: '#',
    icon: FaXTwitter
  },
  {
    name: 'Instagram',
    href: '#',
    icon: FaInstagram
  }
];

interface WelcomeScreenProps {
  onStart: () => Promise<void>;
  isOpenSettings: boolean;
  setIsOpenSettings: (open: boolean) => void;
}

export function WelcomeScreen({ onStart, isOpenSettings, setIsOpenSettings }: WelcomeScreenProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mode, setMode] = useState("off");
  const [isLoading, setIsLoading] = useState(false);
  const { chats, createChat, deleteChat } = useChats();

  const handleCreateChat = async () => {
    try {
      const chat = await createChat("New Chat");
      if (chat?.id) {
        setIsSidebarOpen(false);
        router.push(`/chat/${chat.id}`);
        return chat.id;
      }
      return "";
    } catch (error) {
      console.error("Error creating chat:", error);
      return "";
    }
  };

  const handleSubmit = async (content: string) => {
    setIsLoading(true);
    try {
      const chatId = await handleCreateChat();
      if (chatId) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error submitting message:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Settings/Profile Button */}
      <div className="absolute right-4 top-4">
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsOpenSettings(true)}>
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpenSettings(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-[800px] space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold">Welcome to Haku</h1>
            <p className="text-lg text-muted-foreground">
              Your AI-powered Japanese learning companion
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {examples.map((example, i) => (
              <Card
                key={i}
                className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => {
                  setMode(example.mode.toLowerCase().split("'")[1]);
                  onStart();
                }}
              >
                <p className="font-medium">{example.text}</p>
                <p className="text-sm text-muted-foreground">{example.mode}</p>
              </Card>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            {socialLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                size="icon"
                asChild
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </div>

          <div className="mx-auto max-w-2xl">
            <ChatInput 
              onSubmit={handleSubmit}
              isLoading={isLoading}
              mode={mode}
              setMode={setMode}
            />
          </div>
        </div>
      </div>

      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={chats}
        onDeleteChat={deleteChat}
      />
    </div>
  );
}

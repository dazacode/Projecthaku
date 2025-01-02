export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          id: string
          created_at: string
          title: string
          user_email: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          user_email: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          user_email?: string
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          user_email: string
          chat_id: string
          content: Json
          role: "user" | "assistant"
        }
        Insert: {
          id?: string
          created_at?: string
          user_email: string
          chat_id: string
          content: Json
          role: "user" | "assistant"
        }
        Update: {
          id?: string
          created_at?: string
          user_email?: string
          chat_id?: string
          content?: Json
          role?: "user" | "assistant"
        }
      }
    }
  }
}

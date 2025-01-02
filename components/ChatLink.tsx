import Link from 'next/link'

interface ChatLinkProps {
  chatId: string
  children: React.ReactNode
}

export function ChatLink({ chatId, children }: ChatLinkProps) {
  return (
    <Link href={`/chat/${chatId}`}>
      {children}
    </Link>
  )
} 
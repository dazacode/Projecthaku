-- Create messages table
create table if not exists public.messages (
    id uuid default gen_random_uuid() primary key,
    chat_id uuid not null references public.chats(id) on delete cascade,
    user_email text not null,
    role text not null check (role in ('user', 'assistant')),
    content jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes
create index if not exists messages_chat_id_idx on public.messages(chat_id);
create index if not exists messages_user_email_idx on public.messages(user_email);

-- Enable RLS
alter table public.messages enable row level security;

-- Add policies
create policy "Users can view their own messages"
    on public.messages for select
    using (
        auth.uid()::text = user_email 
        or user_email in (
            select user_email 
            from public.chats 
            where id = messages.chat_id 
            and user_email = auth.uid()::text
        )
    );

create policy "Users can insert their own messages"
    on public.messages for insert
    with check (
        auth.uid()::text = user_email 
        or exists (
            select 1 
            from public.chats 
            where id = chat_id 
            and user_email = auth.uid()::text
        )
    );

create policy "Users can update their own messages"
    on public.messages for update
    using (auth.uid()::text = user_email);

create policy "Users can delete their own messages"
    on public.messages for delete
    using (auth.uid()::text = user_email);

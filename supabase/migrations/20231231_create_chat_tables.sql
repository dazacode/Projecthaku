-- Create chats table
create table if not exists public.chats (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    user_email text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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
create index if not exists chats_user_email_idx on public.chats(user_email);
create index if not exists messages_chat_id_idx on public.messages(chat_id);

-- Add RLS (Row Level Security) policies
alter table public.chats enable row level security;
alter table public.messages enable row level security;

-- Chats policies
create policy "Users can view their own chats"
    on public.chats for select
    using (auth.jwt() ->> 'email' = user_email);

create policy "Users can insert their own chats"
    on public.chats for insert
    with check (auth.jwt() ->> 'email' = user_email);

create policy "Users can update their own chats"
    on public.chats for update
    using (auth.jwt() ->> 'email' = user_email);

create policy "Users can delete their own chats"
    on public.chats for delete
    using (auth.jwt() ->> 'email' = user_email);

-- Messages policies
create policy "Users can view their own messages"
    on public.messages for select
    using (auth.jwt() ->> 'email' = user_email);

create policy "Users can insert their own messages"
    on public.messages for insert
    with check (auth.jwt() ->> 'email' = user_email);

create policy "Users can update their own messages"
    on public.messages for update
    using (auth.jwt() ->> 'email' = user_email);

create policy "Users can delete their own messages"
    on public.messages for delete
    using (auth.jwt() ->> 'email' = user_email);

-- Create chats table
create table if not exists public.chats (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    user_email text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add index
create index if not exists chats_user_email_idx on public.chats(user_email);

-- Enable RLS
alter table public.chats enable row level security;

-- Add policies
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

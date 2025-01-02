-- Create messages table
create table if not exists public.messages (
    id uuid default gen_random_uuid() primary key,
    user_email text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- Create policies
create policy "Users can view their own messages"
    on public.messages for select
    using (auth.jwt() ->> 'email' = user_email);

create policy "Users can insert their own messages"
    on public.messages for insert
    with check (auth.jwt() ->> 'email' = user_email);

-- Create index for faster queries
create index messages_user_email_idx on public.messages(user_email);
create index messages_created_at_idx on public.messages(created_at);

-- Add function to update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- Create trigger for updated_at
create trigger handle_messages_updated_at
    before update on public.messages
    for each row
    execute function public.handle_updated_at();

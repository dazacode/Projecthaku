-- First, let's create a function to get the current user's email
create or replace function auth.email()
returns text
language sql
stable
as $$
  select current_setting('request.headers')::json->>'x-user-email'
$$;

-- Drop existing policies
drop policy if exists "Enable read for users based on user_email" on public.chats;
drop policy if exists "Enable insert for users based on user_email" on public.chats;
drop policy if exists "Enable update for users based on user_email" on public.chats;
drop policy if exists "Enable delete for users based on user_email" on public.chats;

-- Create new policies using the auth.email() function
create policy "Enable read for users based on user_email"
  on public.chats
  for select
  using (auth.email() = user_email);

create policy "Enable insert for users based on user_email"
  on public.chats
  for insert
  with check (auth.email() = user_email);

create policy "Enable update for users based on user_email"
  on public.chats
  for update
  using (auth.email() = user_email);

create policy "Enable delete for users based on user_email"
  on public.chats
  for delete
  using (auth.email() = user_email);

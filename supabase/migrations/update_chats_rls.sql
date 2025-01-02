-- Drop existing policies
drop policy if exists "Users can view their own chats" on public.chats;
drop policy if exists "Users can insert their own chats" on public.chats;
drop policy if exists "Users can update their own chats" on public.chats;
drop policy if exists "Users can delete their own chats" on public.chats;

-- Create new policies
create policy "Enable read for users based on user_email"
  on public.chats
  for select
  using (auth.jwt() ->> 'email' = user_email);

create policy "Enable insert for users based on user_email"
  on public.chats
  for insert
  with check (auth.jwt() ->> 'email' = user_email);

create policy "Enable update for users based on user_email"
  on public.chats
  for update
  using (auth.jwt() ->> 'email' = user_email);

create policy "Enable delete for users based on user_email"
  on public.chats
  for delete
  using (auth.jwt() ->> 'email' = user_email);

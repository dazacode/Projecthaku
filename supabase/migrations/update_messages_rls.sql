-- Drop existing policies
drop policy if exists "Enable read for users based on user_email" on public.messages;
drop policy if exists "Enable insert for users based on user_email" on public.messages;

-- Create new policies using the auth.email() function
create policy "Enable read for users based on user_email"
  on public.messages
  for select
  using (auth.email() = user_email);

create policy "Enable insert for users based on user_email"
  on public.messages
  for insert
  with check (auth.email() = user_email);

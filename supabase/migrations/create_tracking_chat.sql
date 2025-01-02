-- Drop any existing tracking chat
delete from public.chats where id = '00000000-0000-0000-0000-000000000000';

-- Create a special chat for tracking messages
insert into public.chats (id, title, user_email, created_at, updated_at)
values (
  '00000000-0000-0000-0000-000000000000',
  'Message Tracking',
  'system',
  now(),
  now()
);

-- Allow all users to reference this chat
alter table public.messages drop policy if exists "Users can reference tracking chat";
create policy "Users can reference tracking chat"
  on public.messages
  for insert
  with check (
    (chat_id = '00000000-0000-0000-0000-000000000000'::uuid and content->>'type' = 'usage_tracking')
    or
    auth.email() = user_email
  );

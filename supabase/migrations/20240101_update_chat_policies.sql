-- Drop existing policies
drop policy if exists "Users can view their own chats" on public.chats;
drop policy if exists "Users can insert their own chats" on public.chats;
drop policy if exists "Users can update their own chats" on public.chats;
drop policy if exists "Users can delete their own chats" on public.chats;

-- Add updated policies
create policy "Users can view their own chats"
    on public.chats for select
    using (
        user_email = current_user -- For authenticated sessions
        or 
        user_email = (select email from auth.users where id = auth.uid()) -- For JWT auth
    );

create policy "Users can insert their own chats"
    on public.chats for insert
    with check (
        user_email = current_user -- For authenticated sessions
        or 
        user_email = (select email from auth.users where id = auth.uid()) -- For JWT auth
    );

create policy "Users can update their own chats"
    on public.chats for update
    using (
        user_email = current_user -- For authenticated sessions
        or 
        user_email = (select email from auth.users where id = auth.uid()) -- For JWT auth
    );

create policy "Users can delete their own chats"
    on public.chats for delete
    using (
        user_email = current_user -- For authenticated sessions
        or 
        user_email = (select email from auth.users where id = auth.uid()) -- For JWT auth
    );

-- Add special system policy
create policy "System can manage chats"
    on public.chats
    using (auth.role() = 'service_role');

-- Grant usage on auth schema
grant usage on schema auth to service_role;
grant usage on schema auth to anon;
grant usage on schema auth to authenticated;

-- Grant select on users table
grant select on auth.users to service_role;
grant select on auth.users to anon;
grant select on auth.users to authenticated;

-- Create a secure view for public access
create or replace view public.user_profiles as
select 
    id,
    email,
    raw_user_meta_data->>'full_name' as full_name,
    raw_user_meta_data->>'avatar_url' as avatar_url,
    last_sign_in_at,
    created_at,
    updated_at
from auth.users;

-- Enable RLS on the view
alter view public.user_profiles set (security_invoker = true);

-- Grant access to the view
grant select on public.user_profiles to authenticated;
grant select on public.user_profiles to service_role;

-- Add RLS policy for the view
create policy "Users can view their own profile"
    on public.user_profiles
    for select
    using (auth.uid() = id);

-- Add policy for service role
create policy "Service role has full access to user profiles"
    on public.user_profiles
    using (auth.role() = 'service_role');

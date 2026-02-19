
-- 1. Create a trigger function to handle new user signups
-- This function runs automatically whenever a new user is created in auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, organization_name, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'organization_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- 2. Create the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Fix existing users (Backfill)
-- This inserts a profile for any existing user that doesn't have one
insert into public.profiles (id, full_name, organization_name)
select 
  id, 
  coalesce(raw_user_meta_data->>'full_name', 'User'), 
  coalesce(raw_user_meta_data->>'organization_name', 'Organization')
from auth.users
where id not in (select id from public.profiles);

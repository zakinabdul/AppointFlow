
-- Function to update registration count
create or replace function public.update_event_registration_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if (TG_OP = 'INSERT') then
    update public.events
    set current_registrations = current_registrations + 1
    where id = new.event_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.events
    set current_registrations = current_registrations - 1
    where id = old.event_id;
    return old;
  end if;
  return null;
end;
$$;

-- Trigger for new registrations
drop trigger if exists on_registration_change on public.registrations;
create trigger on_registration_change
  after insert or delete on public.registrations
  for each row execute procedure public.update_event_registration_count();

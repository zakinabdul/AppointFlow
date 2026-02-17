
-- Check the slug and id for all events to verify they match what is expected.
select id, title, slug, created_at 
from public.events 
order by created_at desc;

-- Add the new column to the events table
ALTER TABLE public.events
ADD COLUMN confirmation_email_hours INTEGER;

-- Update existing records to have it disabled by default
UPDATE public.events
SET confirmation_email_hours = 0
WHERE confirmation_email_hours IS NULL;

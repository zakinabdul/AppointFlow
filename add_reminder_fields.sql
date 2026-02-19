-- Add custom reminder fields to events table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS custom_reminder_hours integer,
ADD COLUMN IF NOT EXISTS reminder_note text;

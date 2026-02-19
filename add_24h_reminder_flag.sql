-- Add send_24h_reminder column to events table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS send_24h_reminder boolean DEFAULT false;

-- Run this ONCE in Supabase -> SQL Editor if you already ran schema.sql before this update.
alter table categories add column if not exists image_url text;
alter table categories add column if not exists image_public_id text;

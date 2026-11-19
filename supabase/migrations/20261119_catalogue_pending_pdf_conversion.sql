alter table public.catalogue_moderation add column if not exists pending_access_level integer check (pending_access_level between 1 and 3);

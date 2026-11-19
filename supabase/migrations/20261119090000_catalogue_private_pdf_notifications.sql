-- These migrations were also applied on 19 November 2026 to the production Supabase project.
-- Idempotent version for source control and fresh environments.
ALTER TABLE public.book_requests_v2
  ADD COLUMN IF NOT EXISTS requester_email_verified BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS public.book_request_notification_reads(
  firebase_uid TEXT PRIMARY KEY,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT 'epoch'::timestamptz
);
ALTER TABLE public.book_request_notification_reads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.book_request_notification_reads FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.catalogue_private_files(
  book_id TEXT PRIMARY KEY,
  storage_path TEXT NOT NULL UNIQUE,
  rights_attested BOOLEAN NOT NULL DEFAULT FALSE,
  attested_by TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.catalogue_private_files ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.catalogue_private_files FROM anon, authenticated;

-- First selection; never override changes already made by an administrator.
INSERT INTO public.catalogue_moderation(book_id,hidden,deleted,access_level,updated_by)
VALUES
('liv0126',false,false,1,'system_seed_20261119'),
('liv0128',false,false,1,'system_seed_20261119'),
('liv0130',false,false,1,'system_seed_20261119'),
('liv0122',false,false,2,'system_seed_20261119'),
('liv0139',false,false,2,'system_seed_20261119'),
('liv0021',false,false,3,'system_seed_20261119')
ON CONFLICT(book_id) DO NOTHING;

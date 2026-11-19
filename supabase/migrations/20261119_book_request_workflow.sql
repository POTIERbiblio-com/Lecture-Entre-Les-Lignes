alter table public.book_requests_v2 add column if not exists review_workflow jsonb not null default '{}'::jsonb;

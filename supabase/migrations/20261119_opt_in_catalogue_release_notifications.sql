create table if not exists public.reader_notification_preferences(
 firebase_uid text primary key, app_since timestamptz, email_enabled boolean not null default false,
 email_address text, catalogue_seen_at timestamptz not null default now()
);
create table if not exists public.catalogue_release_notices(
 book_id text primary key, title text not null, author text not null, cover text, released_at timestamptz not null default now()
);
create table if not exists public.catalogue_release_email_queue(
 book_id text not null references public.catalogue_release_notices(book_id),
 firebase_uid text not null, sent_at timestamptz, primary key(book_id,firebase_uid)
);
alter table public.reader_notification_preferences enable row level security;
alter table public.catalogue_release_notices enable row level security;
alter table public.catalogue_release_email_queue enable row level security;
revoke all on public.reader_notification_preferences,public.catalogue_release_notices,public.catalogue_release_email_queue from public,anon,authenticated;
grant select,insert,update on public.reader_notification_preferences,public.catalogue_release_notices,public.catalogue_release_email_queue to service_role;
create or replace function public.queue_catalogue_release() returns trigger language plpgsql set search_path=public as $$
begin
 insert into catalogue_release_notices(book_id,title,author,cover)
 values(new.id,new.ficha->>'title',new.ficha->>'author',new.ficha->>'cover');
 insert into catalogue_release_email_queue(book_id,firebase_uid)
 select new.id,firebase_uid from reader_notification_preferences where email_enabled and email_address is not null;
 return new;
end;$$;
drop trigger if exists notify_catalogue_publication on public.catalogue_editorial_books;
create trigger notify_catalogue_publication after insert on public.catalogue_editorial_books for each row execute function public.queue_catalogue_release();

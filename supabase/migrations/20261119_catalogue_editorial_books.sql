create table if not exists public.catalogue_editorial_books (
 id text primary key check (id ~ '^edition-[0-9a-f-]{36}$'),
 ficha jsonb not null check (jsonb_typeof(ficha) = 'object')
);
alter table public.catalogue_editorial_books enable row level security;
revoke all on public.catalogue_editorial_books from anon, authenticated;
grant select on public.catalogue_editorial_books to anon, authenticated;
grant select, insert, update, delete on public.catalogue_editorial_books to service_role;
create policy editorial_visible on public.catalogue_editorial_books for select to anon, authenticated using (
 not exists (select 1 from public.catalogue_moderation m where m.book_id = id and (m.hidden or m.deleted))
);

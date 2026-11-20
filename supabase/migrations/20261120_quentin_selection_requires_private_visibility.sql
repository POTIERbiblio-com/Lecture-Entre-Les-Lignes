create schema if not exists catalogue_security;
create function catalogue_security.editorial_visible(target_id text) returns boolean
language sql stable security definer set search_path = ''
as $$ select not exists (
  select 1 from public.catalogue_moderation m
  where m.book_id = target_id and (m.hidden or m.deleted or m.quentin_only)
) $$;
revoke all on function catalogue_security.editorial_visible(text) from public;
grant usage on schema catalogue_security to anon, authenticated;
grant execute on function catalogue_security.editorial_visible(text) to anon, authenticated;
alter policy editorial_visible on public.catalogue_editorial_books using (catalogue_security.editorial_visible(id));
alter policy "Public can read catalogue status" on public.catalogue_moderation using (not quentin_only);
alter table public.catalogue_moderation add constraint quentin_selection_always_hidden check (not quentin_only or hidden);

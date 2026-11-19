create table if not exists public.catalogue_download_totals (
 book_id text primary key,
 downloads bigint not null default 0 check (downloads >= 0)
);
alter table public.catalogue_download_totals enable row level security;
grant select on public.catalogue_download_totals to anon, authenticated;
grant insert, update, select on public.catalogue_download_totals to service_role;
create policy catalogue_download_totals_public on public.catalogue_download_totals for select to anon, authenticated using (true);
create or replace function public.record_catalogue_download(p_book_id text)
returns void language sql security invoker set search_path = '' as $$
 insert into public.catalogue_download_totals(book_id,downloads) values (p_book_id,1)
 on conflict (book_id) do update set downloads=public.catalogue_download_totals.downloads+1;
$$;
revoke all on function public.record_catalogue_download(text) from public,anon,authenticated;
grant execute on function public.record_catalogue_download(text) to service_role;

create table if not exists public.catalogue_reader_reviews (
 book_id text not null, firebase_uid text not null,
 rating numeric(3,2) not null check (rating between 0 and 5),
 review text not null check (char_length(review) between 1 and 12000),
 spoiler boolean not null default false, updated_at timestamptz not null default now(),
 primary key(book_id,firebase_uid)
);
alter table public.catalogue_reader_reviews enable row level security;
revoke all on public.catalogue_reader_reviews from public,anon,authenticated;
grant select,insert,update,delete on public.catalogue_reader_reviews to service_role;
create or replace function public.catalogue_reader_review_summary(p_book text)
returns jsonb language sql stable set search_path=public as $$
 select jsonb_build_object(
  'count',(select count(*) from catalogue_reader_reviews where book_id=p_book),
  'average',(select avg(rating) from catalogue_reader_reviews where book_id=p_book),
  'reviews',coalesce((select jsonb_agg(to_jsonb(items) order by items.updated_at desc) from
    (select rating,review,spoiler,updated_at from catalogue_reader_reviews where book_id=p_book order by updated_at desc limit 30) items),'[]'::jsonb)
 );
$$;
revoke all on function public.catalogue_reader_review_summary(text) from public,anon,authenticated;
grant execute on function public.catalogue_reader_review_summary(text) to service_role;

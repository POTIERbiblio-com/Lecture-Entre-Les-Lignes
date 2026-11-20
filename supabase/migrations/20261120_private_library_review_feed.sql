alter table public.catalogue_editorial_books add column if not exists published_at timestamptz;
alter table public.catalogue_editorial_books alter column published_at set default now();

alter table public.catalogue_reader_reviews
  add column if not exists id uuid not null default gen_random_uuid(),
  add column if not exists reviewer_name text;
create unique index if not exists catalogue_reader_review_id on public.catalogue_reader_reviews (id);
create index if not exists catalogue_reader_review_feed on public.catalogue_reader_reviews (updated_at desc, id desc);

create or replace function public.catalogue_reader_review_summary(p_book text)
returns jsonb language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'count', (select count(*) from public.catalogue_reader_reviews where book_id = p_book),
    'average', (select avg(rating) from public.catalogue_reader_reviews where book_id = p_book),
    'reviews', coalesce((select jsonb_agg(to_jsonb(items) order by items.updated_at desc, items.id desc)
      from (select id, rating, review, spoiler, updated_at from public.catalogue_reader_reviews
        where book_id = p_book order by updated_at desc, id desc limit 30) items), '[]'::jsonb)
  );
$$;

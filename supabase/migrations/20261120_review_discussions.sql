create table public.reader_review_likes (
  review_id uuid references public.catalogue_reader_reviews(id) on delete cascade,
  account_id text not null,
  primary key(review_id,account_id)
);
create table public.reader_review_comments (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.catalogue_reader_reviews(id) on delete cascade,
  account_id text not null,
  display_name text not null,
  body text not null check(char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create table public.reader_review_notification_reads (
  account_id text primary key,
  seen_at timestamptz not null
);
create index reader_review_likes_owner on public.reader_review_likes(account_id,review_id);
create index reader_review_comments_owner on public.reader_review_comments(account_id,review_id);
create index reader_review_comments_order on public.reader_review_comments(review_id,created_at desc,id desc);
alter table public.reader_review_likes enable row level security;
alter table public.reader_review_comments enable row level security;
alter table public.reader_review_notification_reads enable row level security;
revoke all on public.reader_review_likes,public.reader_review_comments,public.reader_review_notification_reads from public,anon,authenticated;
grant select,insert,update,delete on public.reader_review_likes,public.reader_review_comments,public.reader_review_notification_reads to service_role;

create view public.visible_reader_reviews with (security_invoker=true) as
 select r.* from public.catalogue_reader_reviews r
 where not exists(select 1 from public.catalogue_moderation m
 where m.book_id=r.book_id and (m.hidden or m.deleted or m.quentin_only));
revoke all on public.visible_reader_reviews from public,anon,authenticated;
grant select on public.visible_reader_reviews to service_role;

create function public.reader_review_threads(p_ids uuid[],p_account text default null)
returns jsonb language sql stable set search_path='' as $$
 select coalesce(jsonb_object_agg(r.id,jsonb_build_object(
 'likes',(select count(*) from public.reader_review_likes l where l.review_id=r.id),
 'liked',exists(select 1 from public.reader_review_likes l where l.review_id=r.id and l.account_id=p_account),
 'commented',exists(select 1 from public.reader_review_comments c where c.review_id=r.id and c.account_id=p_account),
 'totalComments',(select count(*) from public.reader_review_comments c where c.review_id=r.id),
 'comments',coalesce((select jsonb_agg(to_jsonb(c) order by c.created_at desc,c.id desc)
 from (select id,display_name,body,created_at from public.reader_review_comments
 where review_id=r.id order by created_at desc,id desc limit 20) c),'[]'::jsonb)
 )),'{}'::jsonb) from public.visible_reader_reviews r where r.id=any(p_ids);
$$;
create function public.reader_review_react(p_id uuid,p_account text,p_liked boolean,p_comment text,p_name text)
returns boolean language plpgsql set search_path='' as $$
begin
 if not exists(select 1 from public.visible_reader_reviews where id=p_id) then return false; end if;
 if p_comment is not null then
  insert into public.reader_review_comments(review_id,account_id,body,display_name)
  values(p_id,p_account,p_comment,p_name);
 elsif p_liked then
  insert into public.reader_review_likes(review_id,account_id) values(p_id,p_account) on conflict do nothing;
 else
  delete from public.reader_review_likes where review_id=p_id and account_id=p_account;
 end if;
 return true;
end; $$;
revoke all on function public.reader_review_threads(uuid[],text),public.reader_review_react(uuid,text,boolean,text,text) from public,anon,authenticated;
grant execute on function public.reader_review_threads(uuid[],text),public.reader_review_react(uuid,text,boolean,text,text) to service_role;

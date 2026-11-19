create or replace function public.reserve_firebase_download(p_uid text,p_book text,p_plan text)
returns boolean language plpgsql set search_path=public as $$
declare cap integer;
begin
 if length(p_uid) not between 1 and 128 or length(p_book) not between 1 and 128 then return false; end if;
 cap:=case p_plan when 'free' then 2 when 'decouverte' then 5 when 'passion' then 10 when 'illimite' then null else 0 end;
 perform pg_advisory_xact_lock(hashtextextended(p_uid||':'||p_book,0));
 if cap is not null and (select count(*) from firebase_book_downloads where firebase_uid=p_uid and book_id=p_book
 and (p_plan='free' or downloaded_at>=date_trunc('month',now())))>=cap then return false;end if;
 insert into firebase_book_downloads(firebase_uid,book_id) values(p_uid,p_book);
 return true;
end;$$;
revoke all on function public.reserve_firebase_download(text,text,text) from public,anon,authenticated;
grant execute on function public.reserve_firebase_download(text,text,text) to service_role;
alter table public.book_requests_v2 add column if not exists boosted boolean not null default false;
create or replace function public.submit_book_request_with_priority(p_request jsonb,p_plan text,p_boost boolean)
returns uuid language plpgsql set search_path=public as $$
declare owner_id text:=p_request->>'firebase_uid'; result uuid; cap integer;
begin
 perform pg_advisory_xact_lock(hashtextextended('requests:'||owner_id,0));
 cap:=case p_plan when 'free' then 3 when 'decouverte' then 5 when 'passion' then 10 else null end;
 if cap is not null and (select count(*) from book_requests_v2 where firebase_uid=owner_id and created_at>=date_trunc('month',now()))>=cap then
  raise exception 'Quota mensuel de propositions atteint';
 end if;
 cap:=case p_plan when 'decouverte' then 1 when 'passion' then 10 when 'illimite' then null else 0 end;
 if p_boost and cap is not null and (select count(*) from book_requests_v2 where firebase_uid=owner_id and boosted and created_at>=date_trunc('month',now()))>=cap then
  raise exception 'Crédits de priorité épuisés pour ce mois';
 end if;
 insert into book_requests_v2(firebase_uid,requester_email,requester_email_verified,title,author,details,cover_path,pdf_path,pdf_name,boosted)
 values(owner_id,p_request->>'requester_email',(p_request->>'requester_email_verified')::boolean,p_request->>'title',p_request->>'author',p_request->'details',p_request->>'cover_path',p_request->>'pdf_path',p_request->>'pdf_name',p_boost)
 returning id into result;
 return result;
end;$$;
revoke all on function public.submit_book_request_with_priority(jsonb,text,boolean) from public,anon,authenticated;
grant execute on function public.submit_book_request_with_priority(jsonb,text,boolean) to service_role;
create table if not exists public.firebase_annotated_exports(firebase_uid text not null,book_id text not null,created_at timestamptz not null default now());
alter table public.firebase_annotated_exports enable row level security;
revoke all on public.firebase_annotated_exports from public,anon,authenticated;
grant select,insert on public.firebase_annotated_exports to service_role;
create or replace function public.reserve_annotated_export(p_uid text,p_book text,p_plan text)
returns boolean language plpgsql set search_path=public as $$
begin
 if p_plan not in ('passion','illimite') then return false; end if;
 perform pg_advisory_xact_lock(hashtextextended('export:'||p_uid||':'||p_book,0));
 if p_plan='passion' and (select count(*) from firebase_annotated_exports where firebase_uid=p_uid and book_id=p_book and created_at>=date_trunc('month',now()))>=3 then return false; end if;
 insert into firebase_annotated_exports(firebase_uid,book_id) values (p_uid,p_book);return true;
end;$$;
revoke all on function public.reserve_annotated_export(text,text,text) from public,anon,authenticated;
grant execute on function public.reserve_annotated_export(text,text,text) to service_role;

CREATE OR REPLACE FUNCTION public.submit_book_request_with_priority(p_request jsonb, p_plan text, p_boost boolean)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare owner_id text:=p_request->>'firebase_uid'; result uuid; cap integer;
begin
 perform pg_advisory_xact_lock(hashtextextended('requests:'||owner_id,0));
 cap:=case p_plan when 'decouverte' then 1 when 'passion' then 15 when 'illimite' then null else 0 end;
 if p_boost and cap is not null and (select count(*) from book_requests_v2 where firebase_uid=owner_id and boosted and created_at>=date_trunc('month',now()))>=cap then
  raise exception 'Crédits de priorité épuisés pour ce mois';
 end if;
 insert into book_requests_v2(firebase_uid,requester_email,requester_email_verified,title,author,details,cover_path,pdf_path,pdf_name,boosted)
 values(owner_id,p_request->>'requester_email',(p_request->>'requester_email_verified')::boolean,p_request->>'title',p_request->>'author',p_request->'details',p_request->>'cover_path',p_request->>'pdf_path',p_request->>'pdf_name',p_boost)
 returning id into result;
 return result;
end;$function$
;

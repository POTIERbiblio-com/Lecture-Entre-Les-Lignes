-- Entre les lignes: schéma préparatoire. À exécuter dans Supabase après revue.
create table if not exists public.book_engagements (
 user_id uuid not null references auth.users(id) on delete cascade,
 book_id text not null,
 liked boolean not null default false,
 updated_at timestamptz not null default now(),
 primary key(user_id,book_id)
);
alter table public.book_engagements enable row level security;
create policy "read own engagement" on public.book_engagements for select to authenticated using (auth.uid()=user_id);
create policy "insert own engagement" on public.book_engagements for insert to authenticated with check (auth.uid()=user_id);
create policy "update own engagement" on public.book_engagements for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "delete own engagement" on public.book_engagements for delete to authenticated using (auth.uid()=user_id);

create table if not exists public.book_download_events (
 id bigint generated always as identity primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 book_id text not null,
 downloaded_at timestamptz not null default now()
);
alter table public.book_download_events enable row level security;
-- Aucun droit INSERT client : seul un serveur sécurisé valide l'accès au PDF et enregistre l'événement.
create policy "read own downloads" on public.book_download_events for select to authenticated using (auth.uid()=user_id);
create or replace view public.book_public_stats with (security_invoker=true) as
 select book_id, count(*) filter(where liked) as likes from public.book_engagements group by book_id;
-- La vue des likes exige une politique de lecture agrégée dédiée avant exposition publique.
-- Ne pas exposer les identités des utilisateurs dans les classements.

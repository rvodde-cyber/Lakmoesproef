-- Lakmoesproef Team Modus — run in Supabase SQL Editor
-- Project: Lakmoesproef (mzpftuwcocsgncwyjhpq)

create table if not exists public.team_sessions (
  id text primary key check (id ~ '^\d{4}$'),
  created_at timestamptz not null default now(),
  pillar_scores jsonb not null default '[]'::jsonb
);

comment on table public.team_sessions is
  'Anonieme teamsessies: alleen 4-cijferige code en geaggregeerde pijlerscores per deelnemer.';

alter table public.team_sessions enable row level security;

create policy "team_sessions_select"
  on public.team_sessions for select
  to anon, authenticated
  using (true);

create policy "team_sessions_insert"
  on public.team_sessions for insert
  to anon, authenticated
  with check (true);

create or replace function public.append_pillar_score(session_code text, scores numeric[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if session_code !~ '^\d{4}$' then
    raise exception 'Ongeldige sessiecode';
  end if;

  if array_length(scores, 1) is distinct from 7 then
    raise exception 'Verwacht precies 7 pijlerscores';
  end if;

  update public.team_sessions
  set pillar_scores = pillar_scores || to_jsonb(scores)
  where id = session_code;

  if not found then
    raise exception 'Sessie niet gevonden';
  end if;
end;
$$;

grant execute on function public.append_pillar_score(text, numeric[]) to anon, authenticated;

-- Realtime (optioneel): voeg team_sessions toe onder Database → Replication als live updates gewenst zijn.

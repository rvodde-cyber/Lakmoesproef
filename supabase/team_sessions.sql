-- Strenge versie: geen directe tabeltoegang voor bezoekers; alleen via functies. Dit bestand is documentatie; de database draait deze migratie al.

create table if not exists public.team_sessions (
  id text primary key check (id ~ '^\d{4}$'),
  created_at timestamptz not null default now(),
  pillar_scores jsonb not null default '[]'::jsonb
);

alter table public.team_sessions enable row level security;
revoke all on public.team_sessions from anon, authenticated;

create or replace function public.create_team_session()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  new_code text;
  tries int := 0;
begin
  delete from public.team_sessions where created_at < now() - interval '30 days';
  loop
    new_code := lpad((floor(random() * 10000))::int::text, 4, '0');
    begin
      insert into public.team_sessions (id) values (new_code);
      return new_code;
    exception when unique_violation then
      tries := tries + 1;
      if tries > 50 then
        raise exception 'Geen vrije sessiecode beschikbaar';
      end if;
    end;
  end loop;
end;
$$;

create or replace function public.submit_team_scores(session_code text, scores numeric[])
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  s numeric;
  n int;
begin
  if session_code is null or session_code !~ '^\d{4}$' then
    raise exception 'Ongeldige sessiecode';
  end if;
  if scores is null or array_length(scores, 1) is distinct from 7 then
    raise exception 'Verwacht zeven scores';
  end if;
  foreach s in array scores loop
    if s is null or s < 1 or s > 5 then
      raise exception 'Scores moeten tussen 1 en 5 liggen';
    end if;
  end loop;
  select jsonb_array_length(pillar_scores) into n
    from public.team_sessions where id = session_code for update;
  if not found then
    raise exception 'Sessie niet gevonden';
  end if;
  if n >= 200 then
    raise exception 'Maximum aantal deelnemers bereikt';
  end if;
  update public.team_sessions
    set pillar_scores = pillar_scores || jsonb_build_array(to_jsonb(scores))
    where id = session_code;
end;
$$;

create or replace function public.get_team_results(session_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rec record;
  n int;
  avgs jsonb;
begin
  if session_code is null or session_code !~ '^\d{4}$' then
    return jsonb_build_object('exists', false);
  end if;
  select * into rec from public.team_sessions where id = session_code;
  if not found then
    return jsonb_build_object('exists', false);
  end if;
  n := jsonb_array_length(rec.pillar_scores);
  if n < 5 then
    return jsonb_build_object('exists', true, 'participants', n, 'minimum', 5, 'averages', null);
  end if;
  select jsonb_agg(round(a, 2) order by i) into avgs from (
    select i, avg((p.row_scores ->> (i - 1))::numeric) as a
    from jsonb_array_elements(rec.pillar_scores) as p(row_scores), generate_series(1, 7) as i
    group by i
  ) t;
  return jsonb_build_object('exists', true, 'participants', n, 'minimum', 5, 'averages', avgs);
end;
$$;

revoke all on function public.create_team_session() from public;
revoke all on function public.submit_team_scores(text, numeric[]) from public;
revoke all on function public.get_team_results(text) from public;
grant execute on function public.create_team_session() to anon, authenticated;
grant execute on function public.submit_team_scores(text, numeric[]) to anon, authenticated;
grant execute on function public.get_team_results(text) to anon, authenticated;

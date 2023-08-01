create extension if not exists moddatetime schema extensions;

create extension if not exists citext schema extensions;

-- user_data table
create table
  public.user_data (
    "user_id" uuid primary key not null references auth.users (id) on update cascade on delete cascade,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "data" jsonb not null default '{ "has_purchased": false, "show_branding": true }'::jsonb
  );

create index on public.user_data using gin (data);

alter table public.user_data enable row level security;

create policy read_own_user_data on public.user_data for
select
  using (auth.uid () = user_id);

create function public.has_user_purchased (user_id uuid) returns boolean language sql stable as $$
  select
    "data"->'has_purchased' = 'true'::jsonb
  from
    public.user_data ud
  where
    ud.user_id = $1;
$$;

create function public.handle_new_user () returns trigger language plpgsql security definer
set
  search_path = public as $$
begin
  insert into public.user_data (user_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();

-- domain_names table
create table
  public.domain_names (
    "id" uuid primary key not null default gen_random_uuid (),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "user_id" uuid not null references auth.users (id) on update cascade on delete cascade,
    "domain_name" citext not null unique
  );

alter table public.domain_names enable row level security;

create policy read_own_domain_names on public.domain_names for
select
  using (auth.uid () = user_id);
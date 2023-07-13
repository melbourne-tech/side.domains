create extension if not exists moddatetime schema extensions;

create extension if not exists citext schema extensions;

create table
  domain_names (
    id uuid primary key not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    user_id uuid not null references auth.users (id) on update cascade on delete cascade,
    domain_name citext not null
  );

create unique index on domain_names (user_id, domain_name);

alter table domain_names enable row level security;

create policy read_own_domain_names on domain_names for
select
  using (auth.uid () = user_id);
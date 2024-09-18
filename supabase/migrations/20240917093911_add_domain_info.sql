create policy create_own_domain_names on public.domain_names for insert to authenticated
with
  check (auth.uid () = user_id);

create type domain_name_mode as enum('watching', 'owned_sales_page');

create type domain_name_status as enum('unknown', 'registered', 'available');

alter table public.domain_names
add column "mode" domain_name_mode not null default 'watching',
add column "status" domain_name_status not null default 'unknown',
add column "whois_data" jsonb,
add column "expires_at" timestamptz,
alter column "user_id"
set default auth.uid ();

-- All existing domain_names are owned
update public.domain_names
set
  "mode" = 'owned_sales_page';
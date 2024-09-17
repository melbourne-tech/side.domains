alter table public.domain_names
add column "is_owned" boolean not null default false,
add column "whois_data" jsonb,
add column "expires_at" timestamptz;

-- All existing domain_names are owned
update public.domain_names
set
  "is_owned" = true;
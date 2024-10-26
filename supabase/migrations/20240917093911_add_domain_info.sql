create policy update_own_domain_names on public.domain_names for
update to authenticated using (auth.uid () = user_id)
with
  check (auth.uid () = user_id);

create policy delete_own_domain_names on public.domain_names for delete to authenticated using (auth.uid () = user_id);

create type domain_name_status as enum('unknown', 'registered', 'available');

alter table public.domain_names
add column "is_owned" boolean not null default false,
add column "status_change_notifications_enabled" boolean not null default true,
add column "status" domain_name_status not null default 'unknown',
add column "whois_data" jsonb,
add column "whois_updated_at" timestamptz,
add column "expires_at" timestamptz,
alter column "user_id"
set default auth.uid ();

revoke all on table public.domain_names
from
  anon,
  authenticated;

grant
select
,
update ("is_owned", "status_change_notifications_enabled"),
delete on table public.domain_names to authenticated;

create trigger domain_names_updated_at before
update on public.domain_names for each row
execute function extensions.moddatetime ('updated_at');

-- All existing domain_names are owned
update public.domain_names
set
  "is_owned" = true;
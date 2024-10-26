create
or replace function public.notify_domain_status_change () returns trigger as $$
declare
  v_supabase_url text;
  v_supabase_service_role_key text;
begin
  select decrypted_secret into v_supabase_url
  from vault.decrypted_secrets
  where name = 'supabase-url';

  select decrypted_secret into v_supabase_service_role_key
  from vault.decrypted_secrets
  where name = 'supabase-service-role-key';

  perform net.http_post(
    url := concat(v_supabase_url, '/functions/v1/notify-domain-status-change'),
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization', concat('Bearer ', v_supabase_service_role_key)
    ),
    body := jsonb_build_object(
      'domain_name_id', new.id,
      'previous_status', old.status,
      'new_status', new.status
    )
  );

  return new;
end;
$$ language plpgsql volatile;

create trigger notify_domain_status_change
after
update on public.domain_names for each row when (
  new.status_change_notifications_enabled = true
  and old.status <> 'unknown'::domain_name_status
  and old.status is distinct
  from
    new.status
)
execute procedure public.notify_domain_status_change ();
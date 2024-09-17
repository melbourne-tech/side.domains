create extension pg_cron
with
  schema extensions;

grant usage on schema cron to postgres;

grant all privileges on all tables in schema cron to postgres;

create
or replace function update_whois (domain_name_id uuid) returns void as $$
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
    url := concat(v_supabase_url, '/functions/v1/update-whois'),
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization', concat('Bearer ', v_supabase_service_role_key)
    ),
    body := concat('{"id": "', domain_name_id::text, '"}')::jsonb
  );
end;
$$ language plpgsql;

select
  cron.schedule (
    'update-whois-every-minute',
    '* * * * *', -- every minute
    $$
    select
      update_whois(id)
    from
      public.domain_names
      where
      extract(
        hour
        from
          created_at
      ) = extract(
        hour
        from
          current_time
      )
      and extract(
        minute
        from
          created_at
      ) = extract(
        minute
        from
          current_time
      );
    $$
  );
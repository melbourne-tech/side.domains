create extension pg_cron
with
  schema pg_catalog;

grant usage on schema cron to postgres;

grant all privileges on all tables in schema cron to postgres;

create
or replace function public.update_whois (domain_name_id uuid) returns void as $$
declare
  v_supabase_url text;
  v_supabase_service_role_key text;
  v_domain_name_id uuid;
begin
  select decrypted_secret into v_supabase_url
  from vault.decrypted_secrets
  where name = 'supabase-url';

  select decrypted_secret into v_supabase_service_role_key
  from vault.decrypted_secrets
  where name = 'supabase-service-role-key';

  select id into v_domain_name_id
  from public.domain_names
  where id = domain_name_id;

  perform net.http_post(
    url := concat(v_supabase_url, '/functions/v1/update-whois'),
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization', concat('Bearer ', v_supabase_service_role_key)
    ),
    body := concat('{"id": "', v_domain_name_id::text, '"}')::jsonb
  );
end;
$$ language plpgsql security invoker volatile;

create
or replace function public.update_whois_trigger () returns trigger as $$
begin
  perform update_whois(new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger update_whois_trigger
after insert on public.domain_names for each row
execute procedure public.update_whois_trigger ();

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
create
or replace function public.handle_new_user () returns trigger as $$
begin
  insert into public.user_data (user_id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql volatile security definer
set
  search_path = '';

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
    body := jsonb_build_object(
      'id', v_domain_name_id::text
    )
  );
end;
$$ language plpgsql volatile
set
  search_path = '';

create
or replace function public.update_whois_trigger () returns trigger as $$
begin
  perform public.update_whois(new.id);
  return new;
end;
$$ language plpgsql security definer
set
  search_path = '';

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
$$ language plpgsql volatile
set
  search_path = '';
alter table public.user_data
add column email citext;

alter table public.user_data
add constraint user_data_email_unique unique (email);

update public.user_data ud
set
  email = (
    select
      email
    from
      auth.users au
    where
      au.id = ud.user_id
  )
where
  email is null;

alter table public.user_data
alter column email
set not null;

create
or replace function public.handle_new_user () returns trigger language plpgsql security definer
set
  search_path = public as $$
begin
  insert into public.user_data (user_id, email)
  values (new.id, new.email);
  return new;
end;
$$;
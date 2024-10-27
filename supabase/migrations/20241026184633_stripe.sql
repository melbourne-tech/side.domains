drop function public.has_user_purchased;

alter table public.user_data
drop column data,
add column stripe_customer_id text unique,
add column stripe_subscription_id text unique,
add column is_subscribed boolean not null default false;
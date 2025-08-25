-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text default 'free' check (role in ('free', 'pro', 'business', 'enterprise')),
  usage_count int default 0,
  max_usage int default 50,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create plans table
create table plans (
  id serial primary key,
  name text not null,
  price int not null,
  features jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create usage_logs table
create table usage_logs (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  action text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default plans
insert into plans (name, price, features) values
  ('Free', 0, '["50 workflow runs per month", "Basic AI agents", "Community support"]'),
  ('Pro', 2900, '["Unlimited workflow runs", "Advanced AI agents", "Priority support", "Custom integrations"]'),
  ('Business', 9900, '["Everything in Pro", "Team collaboration", "Advanced analytics", "API access"]'),
  ('Enterprise', 29900, '["Everything in Business", "White-label solution", "Custom security", "Dedicated support"]');

-- Enable RLS
alter table profiles enable row level security;
alter table plans enable row level security;
alter table usage_logs enable row level security;

-- Profiles policies
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Plans policies (read-only for all authenticated users)
create policy "Users can view plans" on plans
  for select using (auth.role() = 'authenticated');

-- Usage logs policies
create policy "Users can view own usage logs" on usage_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own usage logs" on usage_logs
  for insert with check (auth.uid() = user_id);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, usage_count, max_usage)
  values (new.id, 'free', 0, 50);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to check usage limits
create or replace function public.check_usage_limit()
returns trigger as $$
begin
  if exists (
    select 1 from profiles 
    where id = new.user_id 
    and role = 'free' 
    and usage_count >= max_usage
  ) then
    raise exception 'Usage limit exceeded. Please upgrade your plan.';
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger to check usage limits before inserting usage logs
create trigger check_usage_limit_trigger
  before insert on usage_logs
  for each row execute procedure public.check_usage_limit();

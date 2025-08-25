-- Create workflows table for n8n integration
create table workflows (
  id text primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  type text not null check (type in ('chat', 'rag', 'tools', 'supervisor')),
  status text not null default 'inactive' check (status in ('active', 'inactive', 'testing')),
  webhook_url text,
  n8n_workflow_id text,
  template_used text,
  execution_count integer default 0,
  last_executed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create workflow executions table for logging
create table workflow_executions (
  id uuid default gen_random_uuid() primary key,
  workflow_id text references workflows(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  input_data jsonb,
  output_data jsonb,
  status text not null check (status in ('success', 'error', 'running')),
  execution_time_ms integer,
  error_message text,
  created_at timestamp with time zone default now()
);

-- Add RLS policies for workflows
alter table workflows enable row level security;
alter table workflow_executions enable row level security;

-- Users can only see their own workflows
create policy "Users can view own workflows" on workflows
  for select using (auth.uid() = user_id);

create policy "Users can create own workflows" on workflows
  for insert with check (auth.uid() = user_id);

create policy "Users can update own workflows" on workflows
  for update using (auth.uid() = user_id);

create policy "Users can delete own workflows" on workflows
  for delete using (auth.uid() = user_id);

-- Users can only see their own workflow executions
create policy "Users can view own workflow executions" on workflow_executions
  for select using (auth.uid() = user_id);

create policy "Users can create own workflow executions" on workflow_executions
  for insert with check (auth.uid() = user_id);

-- Create indexes for performance
create index workflows_user_id_idx on workflows(user_id);
create index workflows_status_idx on workflows(status);
create index workflow_executions_workflow_id_idx on workflow_executions(workflow_id);
create index workflow_executions_user_id_idx on workflow_executions(user_id);
create index workflow_executions_created_at_idx on workflow_executions(created_at);

-- Create a function to update execution count
create or replace function update_workflow_execution_count()
returns trigger as $$
begin
  -- Update the execution count and last executed time
  update workflows 
  set 
    execution_count = execution_count + 1,
    last_executed_at = new.created_at
  where id = new.workflow_id;
  
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update execution count
create trigger update_workflow_execution_count_trigger
  after insert on workflow_executions
  for each row execute function update_workflow_execution_count();

-- Add workflow creation to usage tracking
create or replace function track_workflow_usage()
returns trigger as $$
begin
  -- Track workflow creation in usage_logs
  insert into usage_logs (user_id, action, created_at)
  values (new.user_id, 'workflow_created', new.created_at);
  
  return new;
end;
$$ language plpgsql;

-- Create trigger to track workflow creation
create trigger track_workflow_usage_trigger
  after insert on workflows
  for each row execute function track_workflow_usage();

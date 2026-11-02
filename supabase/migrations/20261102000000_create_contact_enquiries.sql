create table if not exists public.contact_enquiries (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_enquiries enable row level security;

-- No anon/authenticated policies are intentionally created.
-- Only the server-side API using the Supabase service-role key can insert/read enquiries.

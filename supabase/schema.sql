-- Supabase SQL Editor で実行してください

create table news_items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  source_url text,
  published_at timestamptz not null,
  created_at timestamptz default now()
);

-- 新しい順に取得するためのインデックス
create index news_items_published_at_idx on news_items(published_at desc);

-- RLS を有効化して anon キーからの全操作を許可（個人用）
alter table news_items enable row level security;

create policy "allow all" on news_items
  for all using (true) with check (true);

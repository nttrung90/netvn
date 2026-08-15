-- Run this file once in Supabase Dashboard → SQL Editor.
-- It creates the data model, RLS policies, Storage bucket and default categories.

create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  color text not null default '#006d64',
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  title text not null check (char_length(title) between 4 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt text not null default '',
  content text not null,
  thumbnail_url text,
  author_name text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_status_published_at_idx on public.posts(status, published_at desc);
create index posts_category_id_idx on public.posts(category_id);
create index posts_search_idx on public.posts using gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')));

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger profiles_touch_updated_at before update on public.profiles for each row execute procedure public.touch_updated_at();
create trigger posts_touch_updated_at before update on public.posts for each row execute procedure public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;

create policy "profiles readable" on public.profiles for select using (true);
create policy "categories readable" on public.categories for select using (true);
create policy "categories admins manage" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "published posts readable" on public.posts for select using (status = 'published');
create policy "admins read all posts" on public.posts for select using (public.is_admin());
create policy "admins insert posts" on public.posts for insert with check (public.is_admin() and author_id = auth.uid());
create policy "admins update posts" on public.posts for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete posts" on public.posts for delete using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('thumbnails', 'thumbnails', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880;

create policy "thumbnail images publicly readable" on storage.objects for select using (bucket_id = 'thumbnails');
create policy "admins upload thumbnails" on storage.objects for insert with check (bucket_id = 'thumbnails' and public.is_admin());
create policy "admins update thumbnails" on storage.objects for update using (bucket_id = 'thumbnails' and public.is_admin());
create policy "admins delete thumbnails" on storage.objects for delete using (bucket_id = 'thumbnails' and public.is_admin());

insert into public.categories (name, slug, color) values
  ('Công nghệ', 'cong-nghe', '#63e6be'),
  ('Khoa học', 'khoa-hoc', '#a5b4fc'),
  ('Điện thoại', 'dien-thoai', '#f8b4c9'),
  ('Máy tính', 'may-tinh', '#93c5fd'),
  ('AI & Dữ liệu', 'ai-du-lieu', '#fcd34d')
on conflict (slug) do update set name = excluded.name, color = excluded.color;

-- After your first OAuth sign-in, run this once (replace the email):
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');

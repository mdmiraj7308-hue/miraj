-- Supabase Storage bucket for portfolio images (hero + about avatars)
-- Safe to re-run: uses ON CONFLICT for the bucket and DROP IF EXISTS for policies.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio',
  'portfolio',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "portfolio_public_read" on storage.objects;
create policy "portfolio_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'portfolio');

drop policy if exists "portfolio_authenticated_insert" on storage.objects;
create policy "portfolio_authenticated_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolio'
    and (storage.foldername(name))[1] = 'avatars'
  );

drop policy if exists "portfolio_authenticated_update" on storage.objects;
create policy "portfolio_authenticated_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'portfolio'
    and (storage.foldername(name))[1] = 'avatars'
  )
  with check (
    bucket_id = 'portfolio'
    and (storage.foldername(name))[1] = 'avatars'
  );

drop policy if exists "portfolio_authenticated_delete" on storage.objects;
create policy "portfolio_authenticated_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'portfolio'
    and (storage.foldername(name))[1] = 'avatars'
  );

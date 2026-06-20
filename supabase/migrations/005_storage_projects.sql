-- Allow authenticated uploads to projects/ folder in portfolio bucket

drop policy if exists "portfolio_authenticated_insert" on storage.objects;
create policy "portfolio_authenticated_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolio'
    and (storage.foldername(name))[1] in ('avatars', 'projects')
  );

drop policy if exists "portfolio_authenticated_update" on storage.objects;
create policy "portfolio_authenticated_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'portfolio'
    and (storage.foldername(name))[1] in ('avatars', 'projects')
  )
  with check (
    bucket_id = 'portfolio'
    and (storage.foldername(name))[1] in ('avatars', 'projects')
  );

drop policy if exists "portfolio_authenticated_delete" on storage.objects;
create policy "portfolio_authenticated_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'portfolio'
    and (storage.foldername(name))[1] in ('avatars', 'projects')
  );

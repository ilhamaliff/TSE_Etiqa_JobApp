-- Supabase Storage Configuration for Private Resumes Bucket

-- 1. Create a private bucket for resumes (size limit: 5MB, only PDFs allowed)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 5242880, '{application/pdf}')
on conflict (id) do update
set public = false,
    file_size_limit = 5242880,
    allowed_mime_types = '{application/pdf}';

-- 2. Allow authenticated applicants to upload resumes only to their own folder
-- Path structure: resumes/userId/filename
-- Folder name: (storage.foldername(name))[1] is the userId
create policy "Applicants can upload to own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'resumes'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Allow applicants to view/read their own resumes
create policy "Applicants can view own resumes"
on storage.objects for select
to authenticated
using (
  bucket_id = 'resumes'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Allow HR/Admin to view all resumes
create policy "HR/Admin can view all resumes"
on storage.objects for select
to authenticated
using (
  bucket_id = 'resumes'
  and public.get_user_role(auth.uid()) = 'HR/Admin'
);

-- 5. Allow Managers to view all resumes
create policy "Managers can view all resumes"
on storage.objects for select
to authenticated
using (
  bucket_id = 'resumes'
  and public.get_user_role(auth.uid()) = 'Manager'
);

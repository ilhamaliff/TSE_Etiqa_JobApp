-- Etiqa Trade Job Application System - Seed Demo Data

-- 1. Insert Branches with static UUIDs
insert into public.branches (id, name, location, address, contact_no)
values
  (
    'd0b5fb0f-f8c5-4d2d-862d-96e08c847d01', 
    'Kuala Lumpur Branch', 
    'Kuala Lumpur', 
    'Level 12, Etiqa Trade Tower, Kuala Lumpur', 
    '03-2200 1100'
  ),
  (
    'd0b5fb0f-f8c5-4d2d-862d-96e08c847d02', 
    'Penang Branch', 
    'Penang', 
    'Bayan Lepas Business Centre, Penang', 
    '04-640 2200'
  ),
  (
    'd0b5fb0f-f8c5-4d2d-862d-96e08c847d03', 
    'Johor Branch', 
    'Johor Bahru', 
    'Taman Molek Commercial Centre, Johor Bahru', 
    '07-330 8800'
  )
on conflict (id) do update set
  name = excluded.name,
  location = excluded.location,
  address = excluded.address,
  contact_no = excluded.contact_no;


-- 2. Insert Sample Job Postings with static UUIDs
insert into public.job_postings (id, branch_id, admin_id, job_title, job_description, job_type, location, salary_range, requirements, posted_date, closing_date, status)
values
  (
    'a0f7e412-2d88-4c66-831d-b53cf5227101',
    'd0b5fb0f-f8c5-4d2d-862d-96e08c847d01',
    null, -- admin_id will link once HR Admin registers and updates
    'Admin Executive',
    'Support daily branch administration, document control, and applicant communication.',
    'Full Time',
    'Kuala Lumpur',
    'RM 2,800 - RM 3,600',
    'Diploma or degree in business; good communication skills; able to use office software',
    '2026-06-04',
    '2026-07-24', -- Active/future closing date
    'Open'
  ),
  (
    'a0f7e412-2d88-4c66-831d-b53cf5227102',
    'd0b5fb0f-f8c5-4d2d-862d-96e08c847d02',
    null,
    'Customer Service Officer',
    'Handle customer enquiries, update service records, and support branch service targets.',
    'Full Time',
    'Penang',
    'RM 2,500 - RM 3,200',
    'SPM or diploma; patient and polite attitude; basic computer skills',
    '2026-06-06',
    '2026-07-25', -- Active/future closing date
    'Open'
  ),
  (
    'a0f7e412-2d88-4c66-831d-b53cf5227103',
    'd0b5fb0f-f8c5-4d2d-862d-96e08c847d03',
    null,
    'Branch Operations Assistant',
    'Assist the manager with branch reports, scheduling, and application follow-up.',
    'Contract',
    'Johor Bahru',
    'RM 2,400 - RM 3,000',
    'Organised work style; able to work in a team; fresh graduates may apply',
    '2026-06-08',
    '2026-07-26', -- Active/future closing date
    'Open'
  )
on conflict (id) do update set
  branch_id = excluded.branch_id,
  job_title = excluded.job_title,
  job_description = excluded.job_description,
  job_type = excluded.job_type,
  location = excluded.location,
  salary_range = excluded.salary_range,
  requirements = excluded.requirements,
  posted_date = excluded.posted_date,
  closing_date = excluded.closing_date,
  status = excluded.status;

# Backend Migration Progress Report

This document outlines the progress, architectural details, and current status of migrating the Etiqa Trade Job Application System from a frontend-only prototype into a Supabase-backed cloud application.

---

## 1. Summary of Changes

### Supabase Auth Integration
* Replaced the mock user array login checks with native **Supabase Authentication** (`supabase.auth.signInWithPassword` and `signUp`).
* Passwords are now handled entirely and securely on the Supabase Auth server. The local application never touches or stores plaintext passwords.
* Active user sessions are managed and persisted automatically by the Supabase GoTrue Auth client.

### PostgreSQL Database Integration
* Replaced the browser-level `localStorage` serialization database with a live **PostgreSQL** database hosted on Supabase.
* Created a database schema with foreign keys, data checks, unique constraints, and automatic timestamps.

### Mappers and Service Layer
* Built a custom mapper layer to seamlessly bridge frontend camelCase fields (e.g. `jobId`, `fullName`) with PostgreSQL snake_case columns (e.g. `id`, `full_name`). This prevented the need to rewrite the 2,200+ lines of frontend rendering and layout logic.
* Extracted database interactions into a clean service module (`src/services/database.js`).

---

## 2. Database Schema (Tables Used)

The database schema utilizes 5 primary tables:

1. **`branches`**: Stores branch office data (id, name, location, address, contact_no).
2. **`profiles`**: Stores public user details (id referencing `auth.users`, full_name, email, role, branch_id, department, phone_no, address, resume_url).
3. **`job_postings`**: Stores available vacancy listings (id, branch_id, admin_id, job_title, job_description, job_type, location, salary_range, requirements, status, closing_date).
4. **`job_applications`**: Stores submitted applicant applications (id, applicant_id, job_id, cover_letter, resume_url, status, last_updated, manager_comment). Has a unique constraint on `(applicant_id, job_id)` to prevent duplicates.
5. **`notifications`**: Stores system updates and status logs for applicants (id, applicant_id, application_id, message, notification_type, is_read, created_at).

---

## 3. Row-Level Security (RLS) Policies

To secure public access, all tables have Row-Level Security enabled with the following rules:

* **`branches`**:
  * Read: Authenticated users (`to authenticated using (true)`).
  * Write: HR/Admin role only (`public.get_user_role(auth.uid()) = 'HR/Admin'`).
* **`profiles`**:
  * Read/Write: Profile owners (`auth.uid() = id`).
  * Read (Auditing): HR/Admins and Managers can view profile details for applicants/users.
  * Insert: Newly signing up users (`auth.uid() = id`).
* **`job_postings`**:
  * Read: Authenticated users (`to authenticated using (true)`).
  * Write: HR/Admin role only (`public.get_user_role(auth.uid()) = 'HR/Admin'`).
* **`job_applications`**:
  * Read/Insert: Applicants can view and submit only their own applications (`auth.uid() = applicant_id`).
  * Read/Write: HR/Admins can view and manage all applications.
  * Read/Write: Managers can view and manage applications only for their assigned branch (`branch_id = public.get_user_branch(auth.uid())`).
* **`notifications`**:
  * Read/Update: Applicants can view and mark read their own notifications (`auth.uid() = applicant_id`).
  * Insert: New applications write confirmations (`auth.uid() = applicant_id`) or Managers/Admins push status updates.

---

## 4. Confirmed Connection Proof

* Dev server operates live at `http://localhost:5173/` utilizing database credentials stored inside `.env.local`.
* Verified live reads by fetching and rendering branch lists and seeded job listings directly from PostgreSQL.
* Verified live writes by successfully executing registration, login, application submissions, and manager status updates.
* Production package compiles cleanly under Rolldown/Vite with zero errors (`npm run build` succeeds).

---

## 5. Remaining Limitations / Recommendations

1. **Email Confirmation**: Supabase Auth email confirmation is assumed to be disabled in the project dashboard settings for testing mock users. If enabled, the signup process will require email verification before profile rows can be inserted.
2. **Offline Mode**: Since data is fetched dynamically from the cloud database, the application will not work without an active internet connection (unlike the prototype which worked offline using browser localStorage).
3. **Database Resets**: The frontend "Refresh data" button retrieves current data but no longer resets table states. To reset tables to default seed values, administrative SQL truncations must be run directly on the Supabase SQL editor.

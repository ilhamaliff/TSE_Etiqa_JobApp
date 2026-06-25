# Supabase Backend Connection & Integration Test Report

This report documents the testing and official verification of the connection between the React + Vite + Tailwind CSS frontend and the Supabase backend (PostgreSQL database + Supabase Auth) for the Etiqa Trade Job Application System.

---

## 1. Test Metadata
* **Date / Time of Test**: 2026-06-26 02:04 AM (GMT+8)
* **Testing Environment**:
  * **Frontend**: React + Vite (Dev Server / Production Build)
  * **Backend**: Supabase Cloud Project (PostgreSQL, Auth Services, Row Level Security)
  * **Database Client**: `@supabase/supabase-js` (anonymous client connection)
* **Local Configuration**: `.env.local` loaded with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

---

## 2. Test Account Catalog
All authentication is handled directly by Supabase Auth. The following mock identities were established:

| Email | Assigned Role | Permissions / Scope |
| :--- | :--- | :--- |
| `applicant@test.com` | `Applicant` | View jobs, submit own applications, view own notifications. |
| `admin@etiqatrade.com` | `HR/Admin` | Manage job postings (all branches), view and update all applications. |
| `manager.kl@etiqatrade.com` | `Manager` | View and manage applications only for the *Kuala Lumpur Branch*. |

---

## 3. Test Cases & Execution Logs

| Test ID | Module | Steps | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **A** | **Auth / Login** | 1. Input `applicant@test.com` & `password123`<br>2. Submit form | Authenticated session is created; Applicant Dashboard opens. | Successfully logged in. Applicant dashboard loaded with stats. | **PASS** |
| **B** | **Job Listings** | 1. Open homepage (`landing` view) while authenticated/guest. | Rendered list populated from `public.job_postings` table. | Showed seeded postings (Admin Executive, Customer Service, Operations Assistant). | **PASS** |
| **C** | **Job Application** | 1. Log in as Applicant<br>2. Select "Admin Executive"<br>3. Input cover letter and resume filename<br>4. Click Apply | Application row created in `job_applications` and submission notification created. | Application and notification successfully written to database. | **PASS** |
| **D** | **Validation** | 1. Open same job posting (`Admin Executive`) as applicant.<br>2. Attempt to apply again. | Prevent submission; show "You have already applied for this job." | Database unique constraint blocks insert and application shows blocker message. | **PASS** |
| **E** | **Auth / Login** | 1. Input `admin@etiqatrade.com` & `password123`<br>2. Submit form | Authenticated session is created; Admin Dashboard opens. | Successfully logged in. Loaded HR/Admin Dashboard. | **PASS** |
| **F** | **Job Creation** | 1. Open Job Management<br>2. Enter details for a new vacancy<br>3. Save posting | New row created in `public.job_postings` table. | New job created successfully and displayed on live list. | **PASS** |
| **G** | **Job Modification**| 1. Select existing job<br>2. Change status to "Closed" or edit text<br>3. Save | Target row updated in `public.job_postings` table. | Job status updated successfully and reflected in landing views. | **PASS** |
| **H** | **Auth / Login** | 1. Input `manager.kl@etiqatrade.com` & `password123`<br>2. Submit form | Authenticated session is created; Manager Dashboard opens. | Successfully logged in. Opened Manager dashboard page. | **PASS** |
| **I** | **Branch Filtering**| 1. Open Applications review as Manager | Only list applications associated with the manager's branch (Kuala Lumpur). | Manager dashboard filtered out other branch applications correctly. | **PASS** |
| **J** | **Status Update** | 1. Select an application<br>2. Choose "Shortlisted" from dropdown<br>3. Submit | `status` field updated in `job_applications`; new notification row created. | Updated table successfully and generated status-update notification. | **PASS** |
| **K** | **Notifications** | 1. Log back in as Applicant<br>2. Navigate to Notifications page | Applicant sees the status update notification from Manager/Admin. | Notifications page fetched and rendered the new status alert from Supabase. | **PASS** |

---

## 4. Conclusion

> [!IMPORTANT]
> **The frontend and Supabase backend are officially connected.** 
> All read operations (fetch data on mount, list filtering) and write operations (authentication, account registration, job posting creation, application submission, status updates, and notification triggers) are fully functional and operate directly against the Supabase PostgreSQL database under appropriate RLS policies.

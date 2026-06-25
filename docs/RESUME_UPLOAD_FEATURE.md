# Secure PDF Resume Upload Feature

This document explains the security architecture, validations, and storage settings configured for applicant resumes in the Etiqa Trade Job Application System.

---

## 1. Security Model: Private vs. Public Storage
Unlike the initial backend prototype which generated public URLs, the system now stores all applicant resumes in a **private Supabase Storage bucket** named `resumes`.

* **No Public URLs:** Direct public access to uploaded files is completely disabled.
* **Storage Path Persistence:** The database tables (`profiles.resume_url` and `job_applications.resume_url`) only store relative paths (e.g. `userId/1719222333-my_resume.pdf`) instead of full URL links.
* **Signed URLs:** To view a resume, the application requests a temporary, cryptographically signed URL from Supabase that is valid for **10 minutes (600 seconds)**. Once it expires, the URL is invalid, preventing unauthorized file access.

---

## 2. Upload Rules & Validations
To prevent storage abuse and protect the system, two layers of validation are enforced:

### Frontend Validation (Instant UX Feedback)
In `src/App.jsx`, when a file is selected on either the **Registration page** or the **Job Application form**:
1. **File Extension/Type check:** The file must have the mime-type `application/pdf` (only `.pdf` documents allowed).
2. **File Size check:** The file size must not exceed **5MB** (5,242,880 bytes).
If any validation fails, the file input is cleared immediately, and a clear error notification is displayed to the user.

### Backend Validation (Service Layer)
In `src/services/database.js`, the `uploadResumeFile(userId, file)` function double-checks the file extension and size before invoking the Supabase SDK storage upload to ensure no invalid requests can bypass client-side checks.

---

## 3. Storage path structure
Resumes are uploaded to the `resumes` bucket with the following path format:
```text
resumes/{userId}/{timestamp}-{cleanFileName}
```
* `{userId}`: The unique UUID of the registered applicant.
* `{timestamp}`: `Date.now()` timestamp to prevent filename collisions if the applicant uploads multiple resumes.
* `{cleanFileName}`: The sanitized original filename with spaces and special characters removed (preserving alphanumeric characters, dots, and hyphens).

---

## 4. Row-Level Security (RLS) Policies
Access to the storage bucket is secured via PostgreSQL RLS policies defined in `database/storage_policies.sql`:

1. **Applicants can upload to own folder:**
   * Permits `INSERT` only if the folder name matches the authenticated user's ID (`auth.uid()`).
2. **Applicants can view own resumes:**
   * Permits `SELECT` only if the folder name matches the authenticated user's ID (`auth.uid()`).
3. **HR/Admin can view all resumes:**
   * Permits `SELECT` if the authenticated user has the `HR/Admin` role in public profiles.
4. **Managers can view all resumes:**
   * Permits `SELECT` if the authenticated user has the `Manager` role in public profiles.

# Etiqa Trade Job Application System - Backend Setup Guide

This guide explains how to set up your Supabase database schema, seed initial data, create demo users, and configure your local environment.

---

## Step 1: Run the Database Schema in Supabase

1. Go to your **Supabase Dashboard**.
2. Select your project and navigate to the **SQL Editor** tab from the left sidebar.
3. Click **New query**.
4. Copy the entire contents of [database/supabase_schema.sql](file:///C:/Users/shukr/OneDrive%20-%20lightdrive/Desktop/TSE%20Project/database/supabase_schema.sql) and paste it into the editor.
5. Click **Run** to execute the queries. This will create all the required tables and configure Row-Level Security (RLS) policies.

---

## Step 2: Seed Initial Branches & Job Postings

1. Create another **New query** in the **SQL Editor**.
2. Copy the contents of [database/seed_demo_data.sql](file:///C:/Users/shukr/OneDrive%20-%20lightdrive/Desktop/TSE%20Project/database/seed_demo_data.sql) and paste it into the editor.
3. Click **Run** to insert the demo branches and initial job listings.

---

## Step 3: Create Demo Users in Supabase Auth

To match the demo flow, create the three required user accounts in Supabase Auth:

1. Navigate to the **Authentication** section in your Supabase Dashboard.
2. Under the **Users** tab, click **Add User** -> **Create User**.
3. Create the following three users with their respective roles and use the password `password123`:
   * **HR Admin**: `admin@etiqatrade.com`
   * **KL Branch Manager**: `manager.kl@etiqatrade.com`
   * **Test Applicant**: `applicant@test.com`
4. Once created, copy the **User UID** (UUID string) for each user. You will need them in the next step.

---

## Step 4: Insert Matching Rows in Profiles

Since the database uses Row-Level Security and links the public `profiles` table to `auth.users`, you need to insert profiles linked to the exact UUIDs generated in Step 3.

1. Navigate back to the **SQL Editor**.
2. Paste the SQL query below, **replacing the placeholder UUIDs** with the actual UIDs copied from the Supabase Authentication console:

```sql
insert into public.profiles (id, full_name, email, role, branch_id, department, phone_no, address, resume_url)
values
  (
    'REPLACE_WITH_HR_ADMIN_UUID', 
    'HR Admin', 
    'admin@etiqatrade.com', 
    'HR/Admin', 
    null, 
    null, 
    null, 
    null, 
    null
  ),
  (
    'REPLACE_WITH_KL_MANAGER_UUID', 
    'KL Branch Manager', 
    'manager.kl@etiqatrade.com', 
    'Manager', 
    'd0b5fb0f-f8c5-4d2d-862d-96e08c847d01', -- KL Branch Static ID
    'Operations', 
    null, 
    null, 
    null
  ),
  (
    'REPLACE_WITH_APPLICANT_UUID', 
    'Test Applicant', 
    'applicant@test.com', 
    'Applicant', 
    null, 
    null, 
    '0123456789', 
    'Shah Alam, Selangor', 
    'test-applicant-resume.pdf'
  );
```

3. Click **Run** to execute the query.

---

## Step 5: Configure Local Environment

Ensure you have a [.env.local](file:///C:/Users/shukr/OneDrive%20-%20lightdrive/Desktop/TSE%20Project/.env.local) file in the root directory containing your project credentials:

```env
VITE_SUPABASE_URL=https://oihwozjpnsdlqtxwfhqh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_G-xsdUpVTLwDLfro_NIAAw_X2A4gmMj
```

*(Note: These are client credentials and are safe to keep locally; never commit this file to git.)*

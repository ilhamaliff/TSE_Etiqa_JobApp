import { supabase } from "../lib/supabaseClient";
import {
  mapBranch,
  mapProfile,
  mapJob,
  mapApplication,
  mapNotification,
  toJobPostingPayload,
} from "./mappers";

// 1. Get the profile of the currently authenticated user
export async function getCurrentProfile() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }
  return mapProfile(data);
}

// 2. Sign in using email and password
export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw new Error(error.message || "Invalid login credentials.");
  }
  return await getCurrentProfile();
}

// 3. Sign out of the session
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message || "Failed to log out.");
  }
}

// Helper to upload a resume PDF file to Supabase Storage resumes bucket
export async function uploadResume(file, userId) {
  const fileExt = file.name.split(".").pop();
  // Safe filename with timestamp to prevent duplicates
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw new Error(error.message || "Failed to upload resume file.");
  }

  const { data: urlData } = supabase.storage
    .from("resumes")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// 4. Register a new applicant (supports optional resume PDF file upload)
export async function registerApplicant(formData, resumeFile) {
  const { fullName, email, password, phoneNo, address } = formData;
  
  // Register in Supabase Auth (handles password securely and automatically)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (authError) {
    throw new Error(authError.message || "Registration auth failed.");
  }

  const user = authData.user;
  if (!user) {
    throw new Error("Registration failed: no user account was created.");
  }

  let finalResumeUrl = formData.resumeUrl || "";

  // If a file is selected, upload it
  if (resumeFile) {
    try {
      finalResumeUrl = await uploadResume(resumeFile, user.id);
    } catch (uploadErr) {
      console.error("Resume upload failed:", uploadErr.message);
    }
  }

  // Create public profile linked to the newly created user ID
  const profilePayload = {
    id: user.id,
    full_name: fullName,
    email: email,
    role: "Applicant",
    phone_no: phoneNo,
    address: address,
    resume_url: finalResumeUrl,
  };

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .insert(profilePayload)
    .select()
    .single();

  if (profileError) {
    throw new Error(profileError.message || "Failed to create user profile.");
  }

  return mapProfile(profileData);
}

// 5. Fetch all database tables and map to camelCase structure
export async function fetchInitialData() {
  const [
    { data: branchesData, error: branchesError },
    { data: profilesData, error: profilesError },
    { data: jobsData, error: jobsError },
    { data: applicationsData, error: applicationsError },
    { data: notificationsData, error: notificationsError },
  ] = await Promise.all([
    supabase.from("branches").select("*"),
    supabase.from("profiles").select("*"),
    supabase.from("job_postings").select("*").order("posted_date", { ascending: false }),
    supabase.from("job_applications").select("*").order("application_date", { ascending: false }),
    supabase.from("notifications").select("*").order("created_at", { ascending: false }),
  ]);

  if (branchesError) throw new Error(branchesError.message || "Failed to fetch branches.");
  if (profilesError) throw new Error(profilesError.message || "Failed to fetch profiles.");
  if (jobsError) throw new Error(jobsError.message || "Failed to fetch job postings.");
  if (applicationsError) throw new Error(applicationsError.message || "Failed to fetch job applications.");
  if (notificationsError) throw new Error(notificationsError.message || "Failed to fetch notifications.");

  return {
    branches: (branchesData || []).map(mapBranch),
    users: (profilesData || []).map(mapProfile),
    jobs: (jobsData || []).map(mapJob),
    applications: (applicationsData || []).map(mapApplication),
    notifications: (notificationsData || []).map(mapNotification),
  };
}

// 6. Submit a new job application and create corresponding notification (supports optional file upload)
export async function submitJobApplication({ applicantId, jobId, coverLetter, resumeUrl, resumeFile, jobTitle }) {
  let finalResumeUrl = resumeUrl;

  if (resumeFile) {
    finalResumeUrl = await uploadResume(resumeFile, applicantId);
  }

  const applicationPayload = {
    applicant_id: applicantId,
    job_id: jobId,
    cover_letter: coverLetter,
    resume_url: finalResumeUrl,
    status: "Submitted",
  };

  const { data: appData, error: appError } = await supabase
    .from("job_applications")
    .insert(applicationPayload)
    .select()
    .single();

  if (appError) {
    if (appError.code === "23505") {
      throw new Error("You have already applied for this job.");
    }
    throw new Error(appError.message || "Failed to submit job application.");
  }

  // Create notification for successful submission
  const notificationPayload = {
    applicant_id: applicantId,
    application_id: appData.id,
    message: `Your application for ${jobTitle} was submitted successfully.`,
    notification_type: "Application",
    is_read: false,
  };

  const { error: notifError } = await supabase
    .from("notifications")
    .insert(notificationPayload);

  if (notifError) {
    console.error("Failed to create application notification:", notifError.message);
  }

  return mapApplication(appData);
}


// 7. Save a job posting (Insert or Update)
export async function saveJobPosting(job, currentUserId) {
  const payload = toJobPostingPayload(job, currentUserId);

  if (job.jobId && job.jobId !== 0) {
    // Update existing job posting
    const { data, error } = await supabase
      .from("job_postings")
      .update(payload)
      .eq("id", job.jobId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || "Failed to update job posting.");
    }
    return mapJob(data);
  } else {
    // Insert new job posting
    const { data, error } = await supabase
      .from("job_postings")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || "Failed to create job posting.");
    }
    return mapJob(data);
  }
}

// 8. Toggle job opening status
export async function updateJobStatus(jobId, newStatus) {
  const { data, error } = await supabase
    .from("job_postings")
    .update({ status: newStatus })
    .eq("id", jobId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update job status.");
  }
  return mapJob(data);
}

// 9. Update job application status and notify applicant
export async function updateApplicationStatus(applicationId, status, applicantId, jobTitle) {
  const { data: appData, error: appError } = await supabase
    .from("job_applications")
    .update({ 
      status: status, 
      last_updated: new Date().toISOString().slice(0, 10) 
    })
    .eq("id", applicationId)
    .select()
    .single();

  if (appError) {
    throw new Error(appError.message || "Failed to update application status.");
  }

  // Create notification for applicant regarding the status change
  const notificationPayload = {
    applicant_id: applicantId,
    application_id: applicationId,
    message: `Your application for ${jobTitle} changed to ${status}.`,
    notification_type: "Status Update",
    is_read: false,
  };

  const { error: notifError } = await supabase
    .from("notifications")
    .insert(notificationPayload);

  if (notifError) {
    console.error("Failed to create status update notification:", notifError.message);
  }

  return mapApplication(appData);
}

// 10. Mark all notifications for user as read
export async function markMyNotificationsRead(userId) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("applicant_id", userId);

  if (error) {
    throw new Error(error.message || "Failed to update notifications.");
  }
}

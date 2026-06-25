// Mapper functions to translate database snake_case columns into App.jsx camelCase fields

export function mapBranch(row) {
  if (!row) return null;
  return {
    branchId: row.id,
    branchName: row.name || row.branch_name,
    branchLocation: row.location || row.branch_location,
    branchAddress: row.address || row.branch_address,
    contactNo: row.contact_no,
  };
}

export function mapProfile(row) {
  if (!row) return null;
  return {
    userId: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    phoneNo: row.phone_no,
    address: row.address,
    resumeUrl: row.resume_url,
    branchId: row.branch_id,
    department: row.department,
    dateRegistered: row.created_at ? row.created_at.slice(0, 10) : null,
  };
}

export function mapJob(row) {
  if (!row) return null;
  return {
    jobId: row.id,
    branchId: row.branch_id,
    adminId: row.admin_id,
    jobTitle: row.job_title,
    jobDescription: row.job_description,
    jobType: row.job_type,
    location: row.location,
    salaryRange: row.salary_range,
    requirements: row.requirements,
    postedDate: row.posted_date,
    closingDate: row.closing_date,
    status: row.status,
  };
}

export function mapApplication(row) {
  if (!row) return null;
  return {
    applicationId: row.id,
    applicantId: row.applicant_id,
    jobId: row.job_id,
    applicationDate: row.application_date,
    coverLetter: row.cover_letter,
    resumeUrl: row.resume_url,
    status: row.status,
    lastUpdated: row.last_updated,
    managerComment: row.manager_comment,
  };
}

export function mapNotification(row) {
  if (!row) return null;
  return {
    notificationId: row.id,
    applicantId: row.applicant_id,
    applicationId: row.application_id,
    message: row.message,
    notificationType: row.notification_type,
    isRead: row.is_read,
    createdAt: row.created_at
      ? new Date(row.created_at).toLocaleString("en-MY", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
        })
      : null,
  };
}

// Reverse mappers for DB payloads (Insert/Update)

export function toJobPostingPayload(job, currentUserId) {
  if (!job) return null;
  const payload = {
    branch_id: job.branchId,
    admin_id: job.adminId || currentUserId,
    job_title: job.jobTitle,
    job_description: job.jobDescription,
    job_type: job.jobType,
    location: job.location,
    salary_range: job.salaryRange,
    requirements: job.requirements,
    posted_date: job.postedDate,
    closing_date: job.closingDate,
    status: job.status,
  };
  // Only append ID if it's a valid non-zero database ID (Vite schema uses 0 for unsaved items)
  if (job.jobId && job.jobId !== 0) {
    payload.id = job.jobId;
  }
  return payload;
}

export function toApplicationPayload(application) {
  if (!application) return null;
  const payload = {
    applicant_id: application.applicantId,
    job_id: application.jobId,
    application_date: application.applicationDate,
    cover_letter: application.coverLetter,
    resume_url: application.resumeUrl,
    status: application.status,
    last_updated: application.lastUpdated,
    manager_comment: application.managerComment,
  };
  if (application.applicationId && application.applicationId !== 0) {
    payload.id = application.applicationId;
  }
  return payload;
}

export function toProfilePayload(profile) {
  if (!profile) return null;
  const payload = {
    full_name: profile.fullName,
    email: profile.email,
    role: profile.role,
    phone_no: profile.phoneNo,
    address: profile.address,
    resume_url: profile.resumeUrl,
    branch_id: profile.branchId,
    department: profile.department,
  };
  if (profile.userId) {
    payload.id = profile.userId;
  }
  return payload;
}

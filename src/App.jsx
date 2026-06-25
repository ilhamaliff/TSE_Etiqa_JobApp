import {
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Eye,
  FileText,
  Filter,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Plus,
  RotateCcw,
  Save,
  Search,
  Upload,
  UserRound,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getCurrentProfile,
  signIn,
  signOut,
  registerApplicant,
  fetchInitialData,
  submitJobApplication,
  saveJobPosting,
  updateJobStatus,
  updateApplicationStatus as updateApplicationStatusService,
  markMyNotificationsRead,
  getResumeViewUrl,
} from "./services/database";

async function handleViewResume(filePath) {
  if (!filePath) return;
  try {
    const url = await getResumeViewUrl(filePath);
    window.open(url, "_blank");
  } catch (err) {
    alert("Failed to view resume: " + err.message);
  }
}
const applicationStatuses = [
  "Draft",
  "Submitted",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Hired",
  "Not Hired",
];
// Old mock defaultData removed. Supabase PostgreSQL dynamic tables are used instead.
function today() {
  return new Date().toISOString().slice(0, 10);
}
function nowText() {
  return new Date().toLocaleString("en-MY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}
function makeId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}
function App() {
  const [data, setData] = useState({
    branches: [],
    users: [],
    jobs: [],
    applications: [],
    notifications: []
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(0);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("All branches");
  const [jobFilter, setJobFilter] = useState("All jobs");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [notice, setNotice] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function reloadData() {
    setLoading(true);
    try {
      const [profile, dbData] = await Promise.all([
        getCurrentProfile(),
        fetchInitialData(),
      ]);
      setData(dbData);
      setCurrentUser(profile);
      if (dbData.jobs?.length > 0 && !selectedJobId) {
        setSelectedJobId(dbData.jobs[0].jobId);
      }
      setNotice("Data has been refreshed.");
    } catch (err) {
      console.error("Refresh error:", err);
      setNotice("Failed to refresh data: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const [profile, dbData] = await Promise.all([
          getCurrentProfile(),
          fetchInitialData(),
        ]);
        setData(dbData);
        setCurrentUser(profile);
        if (dbData.jobs?.length > 0) {
          setSelectedJobId(dbData.jobs[0].jobId);
        }
        if (profile) {
          if (profile.role === "Applicant") setPage("applicantDashboard");
          else if (profile.role === "HR/Admin") setPage("adminDashboard");
          else if (profile.role === "Manager") setPage("managerDashboard");
        } else {
          setPage("landing");
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setNotice("Failed to load initial data from database: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);
  const selectedJob =
    data.jobs.find((job) => job.jobId === selectedJobId) ?? data.jobs[0];
  const selectedApplication =
    data.applications.find(
      (item) => item.applicationId === selectedApplicationId,
    ) ?? null;
  const filteredJobs = data.jobs.filter((job) => {
    const branch = getBranch(data.branches, job.branchId);
    const text =
      `${job.jobTitle} ${job.location} ${branch.branchName}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());
    const matchesBranch =
      branchFilter === "All branches" || branch.branchLocation === branchFilter;
    return matchesSearch && matchesBranch;
  });
  let visibleApplications = data.applications;
  if (currentUser?.role === "Manager") {
    visibleApplications = visibleApplications.filter(
      (app) => getJob(data.jobs, app.jobId).branchId === currentUser.branchId,
    );
  }
  visibleApplications = visibleApplications.filter((app) => {
    const job = getJob(data.jobs, app.jobId);
    const branch = getBranch(data.branches, job.branchId);
    const applicant = getUser(data.users, app.applicantId);
    const matchesBranch =
      branchFilter === "All branches" || branch.branchLocation === branchFilter;
    const matchesJob =
      jobFilter === "All jobs" || String(job.jobId) === jobFilter;
    const matchesStatus =
      statusFilter === "All statuses" || app.status === statusFilter;
    const matchesSearch = `${applicant?.fullName ?? ""} ${job.jobTitle}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesBranch && matchesJob && matchesStatus && matchesSearch;
  });
  function changePage(nextPage) {
    const allowed = canOpenPage(nextPage, currentUser);
    if (!allowed.ok) {
      setNotice(allowed.message);
      setPage("login");
      setMobileMenuOpen(false);
      return;
    }
    setNotice("");
    if (nextPage !== "landing") {
      setSearchTerm("");
    }
    if (nextPage === "landing") {
      setJobFilter("All jobs");
      setStatusFilter("All statuses");
    }
    if (nextPage === "applicationManagement") {
      setSearchTerm("");
      if (currentUser?.role === "Manager") {
        setBranchFilter("All branches");
      }
    }
    if (
      nextPage !== "applicationManagement" &&
      nextPage !== "managerDashboard"
    ) {
      setSelectedApplicationId(null);
    }
    setPage(nextPage);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function openJob(jobId) {
    setSelectedJobId(jobId);
    changePage("jobDetails");
  }
  async function login(email, password) {
    setLoading(true);
    try {
      const profile = await signIn(email, password);
      setCurrentUser(profile);
      setNotice(`Logged in as ${profile.role}.`);
      setSearchTerm("");
      setBranchFilter("All branches");
      setJobFilter("All jobs");
      setStatusFilter("All statuses");
      setSelectedApplicationId(null);
      setPage(
        profile.role === "Applicant"
          ? "applicantDashboard"
          : profile.role === "HR/Admin"
            ? "adminDashboard"
            : "managerDashboard",
      );
    } catch (err) {
      setNotice(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }
  async function logout() {
    setLoading(true);
    try {
      await signOut();
      setCurrentUser(null);
      setSearchTerm("");
      setBranchFilter("All branches");
      setJobFilter("All jobs");
      setStatusFilter("All statuses");
      setSelectedApplicationId(null);
      setNotice("You have logged out.");
      setPage("landing");
    } catch (err) {
      setNotice("Logout failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }
  async function register(user, resumeFile) {
    if (resumeFile) {
      if (resumeFile.type !== "application/pdf") {
        setNotice("Registration failed: Resume file must be a PDF document.");
        return;
      }
      if (resumeFile.size > 5 * 1024 * 1024) {
        setNotice("Registration failed: Resume file size must not exceed 5MB.");
        return;
      }
    }
    setLoading(true);
    try {
      const profile = await registerApplicant(user, resumeFile);
      
      // Update local state with the new profile
      setData(prev => ({
        ...prev,
        users: [...prev.users, profile]
      }));
      
      setCurrentUser(profile);
      setNotice("Registration successful.");
      setPage("applicantDashboard");
    } catch (err) {
      setNotice(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }
  async function submitApplication(formData, resumeFile) {
    if (!currentUser || currentUser.role !== "Applicant") {
      setNotice("Please login as an applicant before applying.");
      setPage("login");
      return;
    }
    if (!selectedJob || selectedJob.status !== "Open") {
      setNotice("This job is not open for application.");
      return;
    }
    if (!formData.coverLetter.trim() || !formData.resumeUrl.trim()) {
      setNotice("Please complete the cover letter and resume file name.");
      return;
    }
    if (resumeFile) {
      if (resumeFile.type !== "application/pdf") {
        setNotice("Application failed: Resume file must be a PDF document.");
        return;
      }
      if (resumeFile.size > 5 * 1024 * 1024) {
        setNotice("Application failed: Resume file size must not exceed 5MB.");
        return;
      }
    }
    const duplicate = data.applications.some(
      (app) =>
        app.applicantId === currentUser.userId &&
        app.jobId === selectedJob.jobId,
    );
    if (duplicate) {
      setNotice("You have already applied for this job.");
      return;
    }
    setLoading(true);
    try {
      await submitJobApplication({
        applicantId: currentUser.userId,
        jobId: selectedJob.jobId,
        coverLetter: formData.coverLetter,
        resumeUrl: formData.resumeUrl,
        resumeFile: resumeFile,
        jobTitle: selectedJob.jobTitle,
      });
      setNotice("Application submitted successfully.");
      await reloadData();
      setPage("applicantDashboard");
    } catch (err) {
      setNotice(err.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  }
  async function saveJob(job) {
    if (
      !job.jobTitle.trim() ||
      !job.jobDescription.trim() ||
      !job.closingDate
    ) {
      setNotice("Please complete the required job fields.");
      return false;
    }
    setLoading(true);
    try {
      const exists = job.jobId && job.jobId !== 0;
      await saveJobPosting(job, currentUser.userId);
      setNotice(exists ? "Job posting updated." : "Job posting created.");
      await reloadData();
      return true;
    } catch (err) {
      setNotice(err.message || "Failed to save job posting.");
      return false;
    } finally {
      setLoading(false);
    }
  }
  async function toggleJobStatus(jobId) {
    const job = data.jobs.find((j) => j.jobId === jobId);
    if (!job) return;
    const newStatus = job.status === "Open" ? "Closed" : "Open";
    setLoading(true);
    try {
      await updateJobStatus(jobId, newStatus);
      setNotice("Job posting status updated.");
      await reloadData();
    } catch (err) {
      setNotice(err.message || "Failed to update job status.");
    } finally {
      setLoading(false);
    }
  }
  async function updateApplicationStatus(applicationId, status, managerComment) {
    const application = data.applications.find(
      (item) => item.applicationId === applicationId,
    );
    if (!application) return;
    const job = getJob(data.jobs, application.jobId);
    setLoading(true);
    try {
      await updateApplicationStatusService(
        applicationId,
        status,
        application.applicantId,
        job.jobTitle
      );
      setNotice("Application status updated and notification created.");
      await reloadData();
    } catch (err) {
      setNotice(err.message || "Failed to update application status.");
    } finally {
      setLoading(false);
    }
  }
  async function markNotificationsRead() {
    if (!currentUser) return;
    setLoading(true);
    try {
      await markMyNotificationsRead(currentUser.userId);
      await reloadData();
    } catch (err) {
      setNotice(err.message || "Failed to update notifications.");
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7faf8] flex flex-col items-center justify-center text-ink">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-700"></div>
          <p className="text-sm font-semibold text-slate-600">Loading Etiqa Job Application System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] text-ink">
      <TopNav
        currentUser={currentUser}
        page={page}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        changePage={changePage}
        logout={logout}
      />
      <main>
        {notice && (
          <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-md border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-900">
              {notice}
            </div>
          </div>
        )}

        {page === "landing" && (
          <LandingPage
            jobs={filteredJobs}
            branches={data.branches}
            searchTerm={searchTerm}
            branchFilter={branchFilter}
            setSearchTerm={setSearchTerm}
            setBranchFilter={setBranchFilter}
            openJob={openJob}
            changePage={changePage}
            openJobsCount={
              data.jobs.filter((job) => job.status === "Open").length
            }
            notificationCount={
              currentUser?.role === "Applicant"
                ? data.notifications.filter(
                    (item) => item.applicantId === currentUser.userId,
                  ).length
                : 0
            }
          />
        )}
        {page === "login" && (
          <LoginPage login={login} changePage={changePage} />
        )}
        {page === "register" && (
          <RegisterPage register={register} changePage={changePage} />
        )}
        {page === "applicantDashboard" && currentUser?.role === "Applicant" && (
          <AppFrame
            page={page}
            currentUser={currentUser}
            changePage={changePage}
          >
            <ApplicantDashboard
              data={data}
              currentUser={currentUser}
              openJob={openJob}
              changePage={changePage}
            />
          </AppFrame>
        )}
        {page === "jobDetails" && selectedJob && (
          <JobDetailsPage
            data={data}
            job={selectedJob}
            currentUser={currentUser}
            submitApplication={submitApplication}
            changePage={changePage}
          />
        )}
        {page === "adminDashboard" && currentUser?.role === "HR/Admin" && (
          <AppFrame
            page={page}
            currentUser={currentUser}
            changePage={changePage}
          >
            <AdminDashboard
              data={data}
              currentUser={currentUser}
              changePage={changePage}
            />
          </AppFrame>
        )}
        {page === "jobManagement" && currentUser?.role === "HR/Admin" && (
          <AppFrame
            page={page}
            currentUser={currentUser}
            changePage={changePage}
          >
            <JobManagementPage
              data={data}
              currentUser={currentUser}
              saveJob={saveJob}
              toggleJobStatus={toggleJobStatus}
              openJob={openJob}
            />
          </AppFrame>
        )}
        {page === "applicationManagement" &&
          (currentUser?.role === "HR/Admin" ||
            currentUser?.role === "Manager") && (
            <AppFrame
              page={page}
              currentUser={currentUser}
              changePage={changePage}
            >
              <ApplicationManagementPage
                data={data}
                currentUser={currentUser}
                applications={visibleApplications}
                branchFilter={branchFilter}
                jobFilter={jobFilter}
                statusFilter={statusFilter}
                searchTerm={searchTerm}
                setBranchFilter={setBranchFilter}
                setJobFilter={setJobFilter}
                setStatusFilter={setStatusFilter}
                setSearchTerm={setSearchTerm}
                updateApplicationStatus={updateApplicationStatus}
                selectedApplication={selectedApplication}
                setSelectedApplicationId={setSelectedApplicationId}
              />
            </AppFrame>
          )}
        {page === "managerDashboard" && currentUser?.role === "Manager" && (
          <AppFrame
            page={page}
            currentUser={currentUser}
            changePage={changePage}
          >
            <ManagerDashboard
              data={data}
              currentUser={currentUser}
              changePage={changePage}
              updateApplicationStatus={updateApplicationStatus}
              selectedApplication={selectedApplication}
              setSelectedApplicationId={setSelectedApplicationId}
            />
          </AppFrame>
        )}
        {page === "notifications" && currentUser && (
          <AppFrame
            page={page}
            currentUser={currentUser}
            changePage={changePage}
          >
            <NotificationsPage
              data={data}
              currentUser={currentUser}
              markNotificationsRead={markNotificationsRead}
            />
          </AppFrame>
        )}
      </main>
      <button
        className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-soft hover:bg-slate-50"
        onClick={reloadData}
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Refresh data
      </button>
    </div>
  );
}
function canOpenPage(page, user) {
  const publicPages = ["landing", "login", "register", "jobDetails"];
  if (publicPages.includes(page)) return { ok: true, message: "" };
  if (!user)
    return { ok: false, message: "Please login before opening that page." };
  if (page === "applicantDashboard" && user.role !== "Applicant")
    return { ok: false, message: "This page is for applicants only." };
  if (
    (page === "adminDashboard" || page === "jobManagement") &&
    user.role !== "HR/Admin"
  ) {
    return { ok: false, message: "This page is for HR/Admin only." };
  }
  if (page === "managerDashboard" && user.role !== "Manager")
    return { ok: false, message: "This page is for managers only." };
  if (page === "notifications" && user.role !== "Applicant")
    return { ok: false, message: "Notifications are for applicants only." };
  if (page === "applicationManagement" && user.role === "Applicant") {
    return {
      ok: false,
      message: "Application management is for HR/Admin and Manager users only.",
    };
  }
  return { ok: true, message: "" };
}
function TopNav({
  currentUser,
  page,
  mobileMenuOpen,
  setMobileMenuOpen,
  changePage,
  logout,
}) {
  const showNotifications = currentUser?.role === "Applicant";
  const quickLinks = [
    { label: "Jobs", page: "landing" },
    { label: "Applicant", page: "applicantDashboard" },
    { label: "HR/Admin", page: "adminDashboard" },
    { label: "Manager", page: "managerDashboard" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button
          className="flex items-center gap-3 text-left"
          onClick={() => changePage("landing")}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-700 text-white">
            <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-bold text-ink">
              Etiqa Trade Sdn Bhd
            </span>
            <span className="block text-xs text-slate-500">
              Job Application System
            </span>
          </span>
        </button>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {quickLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => changePage(link.page)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${page === link.page ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          {currentUser ? (
            <>
              {showNotifications && (
                <button
                  className="btn-secondary"
                  onClick={() => changePage("notifications")}
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  Notifications
                </button>
              )}
              <span className="rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                {currentUser.role}: {currentUser.fullName}
              </span>
              <button className="btn-primary" onClick={logout}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => changePage("login")}>
              Login
            </button>
          )}
        </div>

        <button
          className="btn-secondary sm:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
          <div className="grid gap-2">
            {quickLinks.map((link) => (
              <button
                key={link.label}
                className="btn-secondary justify-start"
                onClick={() => changePage(link.page)}
              >
                {link.label}
              </button>
            ))}
            {currentUser ? (
              <>
                {showNotifications && (
                  <button
                    className="btn-secondary justify-start"
                    onClick={() => changePage("notifications")}
                  >
                    Notifications
                  </button>
                )}
                <button className="btn-primary justify-start" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <button
                className="btn-primary justify-start"
                onClick={() => changePage("login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
function LandingPage({
  jobs,
  branches,
  searchTerm,
  branchFilter,
  setSearchTerm,
  setBranchFilter,
  openJob,
  changePage,
  openJobsCount,
  notificationCount,
}) {
  return (
    <div className="page-shell">
      <section className="grid gap-6 py-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold text-brand-700">
            Centralised recruitment platform
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-normal text-ink sm:text-4xl">
            Apply for Etiqa Trade branch jobs in one simple system.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Browse vacancies, submit applications, and track your application
            status.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="btn-primary"
              onClick={() => changePage("register")}
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Register as Applicant
            </button>
            <button
              className="btn-secondary"
              onClick={() => changePage("login")}
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              Login
            </button>
          </div>
        </div>
        <div className="panel p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label="Open jobs"
              value={String(openJobsCount)}
              icon={<BriefcaseBusiness className="h-5 w-5" />}
            />
            <StatCard
              label="Branches"
              value={String(branches.length)}
              icon={<Building2 className="h-5 w-5" />}
            />
            <StatCard
              label="My updates"
              value={String(notificationCount)}
              icon={<Bell className="h-5 w-5" />}
            />
          </div>
          <div className="mt-5 rounded-lg bg-brand-50 p-4 text-sm leading-6 text-brand-900">
            Demo accounts are listed on the Login page. Demo data is saved in
            this browser.
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">
              Available job vacancies
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search by position or filter by branch.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px] md:w-[520px]">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                className="input-field pl-9"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search job title or location"
                aria-label="Search job title or location"
              />
            </div>
            <select
              className="input-field"
              value={branchFilter}
              onChange={(event) => setBranchFilter(event.target.value)}
            >
              <option>All branches</option>
              {branches.map((branch) => (
                <option key={branch.branchId}>{branch.branchLocation}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job.jobId}
              job={job}
              branches={branches}
              openJob={openJob}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
function LoginPage({ login, changePage }) {
  const [email, setEmail] = useState("applicant@test.com");
  const [password, setPassword] = useState("password123");
  function submit(event) {
    event.preventDefault();
    login(email, password);
  }
  return (
    <div className="page-shell flex min-h-[calc(100vh-80px)] items-center justify-center">
      <section className="panel w-full max-w-xl p-6 sm:p-8">
        <PageHeading
          eyebrow="System login"
          title="Login"
          description="Use one of the demo accounts to open the correct role dashboard."
        />
        <form className="mt-6 grid gap-4" onSubmit={submit}>
          <label className="grid gap-2">
            <span className="label">Email address</span>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                className="input-field pl-9"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
              />
            </div>
          </label>
          <label className="grid gap-2">
            <span className="label">Password</span>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                className="input-field pl-9"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
              />
            </div>
          </label>
          <button className="btn-primary" type="submit">
            Login
          </button>
        </form>
        <div className="mt-5 rounded-md bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-ink">Demo accounts</p>
          <div className="mt-3 grid gap-2">
            <button
              className="btn-secondary justify-start"
              type="button"
              onClick={() => {
                setEmail("applicant@test.com");
                setPassword("password123");
              }}
            >
              Use Applicant Demo
            </button>
            <button
              className="btn-secondary justify-start"
              type="button"
              onClick={() => {
                setEmail("admin@etiqatrade.com");
                setPassword("password123");
              }}
            >
              Use HR/Admin Demo
            </button>
            <button
              className="btn-secondary justify-start"
              type="button"
              onClick={() => {
                setEmail("manager.kl@etiqatrade.com");
                setPassword("password123");
              }}
            >
              Use Manager Demo
            </button>
          </div>
          <p className="mt-3">Password for all demo accounts: password123</p>
        </div>
        <div className="mt-5 flex flex-wrap justify-between gap-3">
          <button
            className="text-sm font-semibold text-brand-700"
            onClick={() => changePage("register")}
          >
            Create applicant account
          </button>
          <button
            className="text-sm font-semibold text-slate-600"
            onClick={() => changePage("landing")}
          >
            Back to job listings
          </button>
        </div>
      </section>
    </div>
  );
}
function RegisterPage({ register, changePage }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Full name, email, and password are required.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    register({ fullName, email, password, phoneNo, address, resumeUrl }, resumeFile);
  }
  return (
    <div className="page-shell">
      <button
        className="btn-secondary mb-5"
        onClick={() => changePage("landing")}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to jobs
      </button>
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <PageHeading
          eyebrow="Applicant registration"
          title="Create an applicant account"
          description="Create your applicant profile before applying for a job."
        />
        <form className="panel grid gap-4 p-6" onSubmit={submit}>
          {error && <ErrorBox>{error}</ErrorBox>}
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Full name"
              value={fullName}
              onChange={setFullName}
            />
            <TextInput
              label="Phone number"
              value={phoneNo}
              onChange={setPhoneNo}
            />
          </div>
          <TextInput
            label="Email address"
            value={email}
            onChange={setEmail}
            type="email"
          />
          <TextInput label="Address" value={address} onChange={setAddress} />
          <label className="grid gap-2">
            <span className="label">Resume (PDF Format)</span>
            <input
              className="input-field"
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.type !== "application/pdf") {
                    setNotice("Resume file must be a PDF document.");
                    e.target.value = null;
                    setResumeFile(null);
                    setResumeUrl("");
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    setNotice("Resume file size must not exceed 5MB.");
                    e.target.value = null;
                    setResumeFile(null);
                    setResumeUrl("");
                    return;
                  }
                  setResumeFile(file);
                  setResumeUrl(file.name);
                }
              }}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
            />
            <TextInput
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              type="password"
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="btn-primary" type="submit">
              Register
            </button>
            <button
              className="btn-secondary"
              type="button"
              onClick={() => changePage("login")}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
function AppFrame({ page, currentUser, changePage, children }) {
  const navItems =
    currentUser.role === "Applicant"
      ? [
          {
            label: "Dashboard",
            page: "applicantDashboard",
            icon: LayoutDashboard,
          },
          { label: "Jobs", page: "landing", icon: BriefcaseBusiness },
          { label: "Notifications", page: "notifications", icon: Bell },
        ]
      : currentUser.role === "HR/Admin"
        ? [
            {
              label: "Dashboard",
              page: "adminDashboard",
              icon: LayoutDashboard,
            },
            {
              label: "Job Management",
              page: "jobManagement",
              icon: BriefcaseBusiness,
            },
            {
              label: "Applications",
              page: "applicationManagement",
              icon: ClipboardList,
            },
          ]
        : [
            {
              label: "Dashboard",
              page: "managerDashboard",
              icon: LayoutDashboard,
            },
            {
              label: "Applications",
              page: "applicationManagement",
              icon: ClipboardList,
            },
          ];
  return (
    <div className="page-shell grid gap-5 lg:grid-cols-[240px_1fr]">
      <aside className="panel h-fit p-3">
        <div className="border-b border-slate-200 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {currentUser.role}
          </p>
          <p className="mt-1 text-sm font-bold text-ink">
            {currentUser.fullName}
          </p>
        </div>
        <nav
          className="mt-3 grid gap-1"
          aria-label={`${currentUser.role} navigation`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${page === item.page ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`}
                onClick={() => changePage(item.page)}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
function ApplicantDashboard({ data, currentUser, openJob, changePage }) {
  const myApplications = data.applications.filter(
    (item) => item.applicantId === currentUser.userId,
  );
  const unread = data.notifications.filter(
    (item) => item.applicantId === currentUser.userId && !item.isRead,
  ).length;
  return (
    <div className="grid gap-5">
      <PageHeading
        eyebrow="Applicant module"
        title={`Welcome, ${currentUser.fullName}`}
        description="Track your own submitted applications and notifications."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Submitted applications"
          value={String(myApplications.length)}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Unread notifications"
          value={String(unread)}
          icon={<Bell className="h-5 w-5" />}
        />
        <StatCard
          label="Resume on file"
          value={currentUser.resumeUrl ? "Yes" : "No"}
          icon={<Upload className="h-5 w-5" />}
        />
      </div>
      <div className="panel overflow-hidden">
        <SectionHeader
          title="My applications"
          action={
            <button
              className="btn-primary"
              onClick={() => changePage("landing")}
            >
              Find jobs
            </button>
          }
        />
        <ResponsiveTable
          headers={["Job", "Branch", "Submitted", "Status", "Action"]}
          rows={myApplications.map((application) => {
            const job = getJob(data.jobs, application.jobId);
            return [
              job.jobTitle,
              getBranch(data.branches, job.branchId).branchLocation,
              application.applicationDate,
              <StatusBadge key="status" status={application.status} />,
              <button
                key="action"
                className="btn-secondary"
                onClick={() => openJob(job.jobId)}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                View
              </button>,
            ];
          })}
        />
      </div>
      <div className="panel p-5">
        <h2 className="text-base font-bold text-ink">Applicant profile</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <InfoRow label="Email" value={currentUser.email} />
          <InfoRow
            label="Phone"
            value={currentUser.phoneNo || "[Not provided]"}
          />
          <InfoRow
            label="Address"
            value={currentUser.address || "[Not provided]"}
          />
          <InfoRow
            label="Resume"
            value={currentUser.resumeUrl || "[Not provided]"}
          />
        </div>
      </div>
    </div>
  );
}
function JobDetailsPage({
  data,
  job,
  currentUser,
  submitApplication,
  changePage,
}) {
  const branch = getBranch(data.branches, job.branchId);
  const [coverLetter, setCoverLetter] = useState(
    "I would like to apply for this position because my skills match the job requirements.",
  );
  const [resumeUrl, setResumeUrl] = useState(
    currentUser?.resumeUrl || "resume.pdf",
  );
  const [resumeFile, setResumeFile] = useState(null);
  return (
    <div className="page-shell">
      <button
        className="btn-secondary mb-5"
        onClick={() => changePage("landing")}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to job listings
      </button>
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-5">
          <div className="panel p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-700">
                  {job.jobType}
                </p>
                <h1 className="mt-2 text-2xl font-bold text-ink">
                  {job.jobTitle}
                </h1>
              </div>
              <JobStatusBadge status={job.status} />
            </div>
            <p className="mt-4 leading-7 text-slate-600">
              {job.jobDescription}
            </p>
            <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
              <InfoPill
                icon={<Building2 className="h-4 w-4" />}
                label={branch.branchName}
              />
              <InfoPill
                icon={<MapPin className="h-4 w-4" />}
                label={job.location}
              />
              <InfoPill
                icon={<BriefcaseBusiness className="h-4 w-4" />}
                label={job.salaryRange}
              />
              <InfoPill
                icon={<Bell className="h-4 w-4" />}
                label={`Closing ${job.closingDate}`}
              />
            </div>
          </div>
          <div className="panel p-6">
            <h2 className="text-base font-bold text-ink">Requirements</h2>
            <ul className="mt-3 grid gap-2">
              {job.requirements.split(";").map((requirement) => (
                <li
                  key={requirement}
                  className="flex gap-2 text-sm text-slate-600"
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 flex-none text-brand-700"
                    aria-hidden="true"
                  />
                  {requirement.trim()}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <form
          className="panel grid gap-4 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            submitApplication({ coverLetter, resumeUrl }, resumeFile);
          }}
        >
          <PageHeading
            eyebrow="Application form"
            title="Apply for this job"
            description="Complete the required details and submit the application."
          />
          {currentUser?.role !== "Applicant" && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Please login as an Applicant to submit an application.
            </div>
          )}
          <TextInput
            label="Applicant name"
            value={currentUser?.fullName || ""}
            onChange={() => undefined}
            disabled
          />
          {currentUser?.resumeUrl && (
            <div className="rounded-md bg-brand-50 p-3 text-sm text-brand-900 flex items-center justify-between">
              <span>Current resume on file is saved.</span>
              <button
                type="button"
                onClick={() => handleViewResume(currentUser.resumeUrl)}
                className="font-bold underline text-brand-700 hover:text-brand-900 bg-transparent border-none cursor-pointer p-0"
              >
                View Current PDF
              </button>
            </div>
          )}
          <label className="grid gap-2">
            <span className="label">Upload New Resume (PDF Format)</span>
            <input
              className="input-field"
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.type !== "application/pdf") {
                    setNotice("Resume file must be a PDF document.");
                    e.target.value = null;
                    setResumeFile(null);
                    setResumeUrl("");
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    setNotice("Resume file size must not exceed 5MB.");
                    e.target.value = null;
                    setResumeFile(null);
                    setResumeUrl("");
                    return;
                  }
                  setResumeFile(file);
                  setResumeUrl(file.name);
                }
              }}
            />
          </label>
          <label className="grid gap-2">
            <span className="label">Cover letter</span>
            <textarea
              className="input-field min-h-32"
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="btn-primary"
              disabled={job.status === "Closed"}
            >
              Submit Application
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => changePage("landing")}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
function AdminDashboard({ data, currentUser, changePage }) {
  return (
    <div className="grid gap-5">
      <PageHeading
        eyebrow="HR/Admin module"
        title={`Good day, ${currentUser.fullName}`}
        description="Manage job postings, review applications, and update applicant statuses from one dashboard."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Total postings"
          value={String(data.jobs.length)}
          icon={<BriefcaseBusiness className="h-5 w-5" />}
        />
        <StatCard
          label="Open postings"
          value={String(
            data.jobs.filter((job) => job.status === "Open").length,
          )}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Applications"
          value={String(data.applications.length)}
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatCard
          label="Branches"
          value={String(data.branches.length)}
          icon={<Building2 className="h-5 w-5" />}
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="panel p-5">
          <SectionHeader title="Priority actions" />
          <div className="mt-4 grid gap-3">
            <button
              className="btn-primary justify-start"
              onClick={() => changePage("jobManagement")}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create or edit job posting
            </button>
            <button
              className="btn-secondary justify-start"
              onClick={() => changePage("applicationManagement")}
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Filter submitted applications
            </button>
          </div>
        </div>
        <div className="panel overflow-hidden">
          <SectionHeader title="Recent applications" />
          <ResponsiveTable
            headers={["Applicant", "Job", "Status"]}
            rows={data.applications
              .slice(0, 4)
              .map((application) => [
                getUser(data.users, application.applicantId)?.fullName ??
                  "Unknown",
                getJob(data.jobs, application.jobId).jobTitle,
                <StatusBadge
                  key={application.applicationId}
                  status={application.status}
                />,
              ])}
          />
        </div>
      </div>
    </div>
  );
}
function JobManagementPage({
  data,
  currentUser,
  saveJob,
  toggleJobStatus,
  openJob,
}) {
  const emptyJob = {
    jobId: 0,
    branchId: data.branches[0].branchId,
    adminId: currentUser.userId,
    jobTitle: "",
    jobDescription: "",
    jobType: "Full Time",
    location: data.branches[0].branchLocation,
    salaryRange: "",
    requirements: "",
    postedDate: today(),
    closingDate: today(),
    status: "Open",
  };
  const [formJob, setFormJob] = useState(emptyJob);
  async function submit(event) {
    event.preventDefault();
    const branch = getBranch(data.branches, formJob.branchId);
    const saved = await saveJob({
      ...formJob,
      jobId: formJob.jobId,
      branchId: formJob.branchId,
      adminId: currentUser.userId,
      location: branch.branchLocation,
    });
    if (saved) {
      setFormJob(emptyJob);
    }
  }
  function editJob(job) {
    setFormJob(job);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }
  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <PageHeading
          eyebrow="HR/Admin module"
          title="Job management"
          description="Create, edit, open, and close job postings."
        />
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={() => setFormJob(emptyJob)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Job
          </button>
        </div>
      </div>
      <div className="panel overflow-hidden">
        <ResponsiveTable
          headers={[
            "Job title",
            "Branch",
            "Type",
            "Closing date",
            "Status",
            "Action",
          ]}
          rows={data.jobs.map((job) => [
            job.jobTitle,
            getBranch(data.branches, job.branchId).branchLocation,
            job.jobType,
            job.closingDate,
            <JobStatusBadge key="status" status={job.status} />,
            <div key="actions" className="flex flex-wrap gap-2">
              <button
                className="btn-secondary"
                onClick={() => openJob(job.jobId)}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                View
              </button>
              <button className="btn-secondary" onClick={() => editJob(job)}>
                <Edit3 className="h-4 w-4" aria-hidden="true" />
                Edit
              </button>
              <button
                className="btn-secondary"
                onClick={() => toggleJobStatus(job.jobId)}
              >
                {job.status === "Open" ? "Close" : "Open"}
              </button>
            </div>,
          ])}
        />
      </div>
      <form className="panel grid gap-4 p-5 md:grid-cols-2" onSubmit={submit}>
        <TextInput
          label="Job title"
          value={formJob.jobTitle}
          onChange={(value) => setFormJob({ ...formJob, jobTitle: value })}
        />
        <label className="grid gap-2">
          <span className="label">Branch</span>
          <select
            className="input-field"
            value={formJob.branchId}
            onChange={(event) =>
              setFormJob({ ...formJob, branchId: event.target.value })
            }
          >
            {data.branches.map((branch) => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchLocation}
              </option>
            ))}
          </select>
        </label>
        <TextInput
          label="Job type"
          value={formJob.jobType}
          onChange={(value) => setFormJob({ ...formJob, jobType: value })}
        />
        <TextInput
          label="Salary range"
          value={formJob.salaryRange}
          onChange={(value) => setFormJob({ ...formJob, salaryRange: value })}
        />
        <TextInput
          label="Closing date"
          value={formJob.closingDate}
          onChange={(value) => setFormJob({ ...formJob, closingDate: value })}
          type="date"
        />
        <label className="grid gap-2">
          <span className="label">Status</span>
          <select
            className="input-field"
            value={formJob.status}
            onChange={(event) =>
              setFormJob({ ...formJob, status: event.target.value })
            }
          >
            <option>Open</option>
            <option>Closed</option>
          </select>
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="label">Job description</span>
          <textarea
            className="input-field min-h-24"
            value={formJob.jobDescription}
            onChange={(event) =>
              setFormJob({ ...formJob, jobDescription: event.target.value })
            }
          />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="label">Requirements</span>
          <textarea
            className="input-field min-h-20"
            value={formJob.requirements}
            onChange={(event) =>
              setFormJob({ ...formJob, requirements: event.target.value })
            }
            placeholder="Separate requirements with semicolon"
          />
        </label>
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button className="btn-primary" type="submit">
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Job Posting
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => setFormJob(emptyJob)}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
function ApplicationManagementPage({
  data,
  currentUser,
  applications,
  branchFilter,
  jobFilter,
  statusFilter,
  searchTerm,
  setBranchFilter,
  setJobFilter,
  setStatusFilter,
  setSearchTerm,
  updateApplicationStatus,
  selectedApplication,
  setSelectedApplicationId,
}) {
  const managerBranch =
    currentUser.role === "Manager"
      ? getBranch(data.branches, currentUser.branchId ?? 0)
      : null;
  return (
    <div className="grid gap-5">
      <PageHeading
        eyebrow="Application review"
        title="Application management"
        description={
          currentUser.role === "Manager"
            ? "Only applications for your assigned branch are shown."
            : "Filter applications by branch, job, and status."
        }
      />
      {managerBranch && (
        <div className="rounded-md border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-900">
          Manager branch access: {managerBranch.branchName}
        </div>
      )}
      <div className="panel grid gap-3 p-4 md:grid-cols-4">
        <label className="grid gap-2">
          <span className="label">Search applicant/job</span>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              className="input-field pl-9"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search"
            />
          </div>
        </label>
        <label className="grid gap-2">
          <span className="label">Branch filter</span>
          <select
            className="input-field"
            value={branchFilter}
            onChange={(event) => setBranchFilter(event.target.value)}
            disabled={currentUser.role === "Manager"}
          >
            <option>All branches</option>
            {data.branches.map((branch) => (
              <option key={branch.branchId}>{branch.branchLocation}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="label">Job filter</span>
          <select
            className="input-field"
            value={jobFilter}
            onChange={(event) => setJobFilter(event.target.value)}
          >
            <option>All jobs</option>
            {data.jobs.map((job) => (
              <option key={job.jobId} value={job.jobId}>
                {job.jobTitle}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="label">Status filter</span>
          <select
            className="input-field"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All statuses</option>
            {applicationStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="panel overflow-hidden">
        <ResponsiveTable
          headers={[
            "Applicant",
            "Job",
            "Branch",
            "Resume",
            "Status",
            "Update",
            "Details",
          ]}
          rows={applications.map((application) => {
            const job = getJob(data.jobs, application.jobId);
            const applicant = getUser(data.users, application.applicantId);
            const branch = getBranch(data.branches, job.branchId);
            const branchDisplay = branch ? `${branch.branchLocation} (${branch.branchName})` : "Unknown";
            return [
              applicant?.fullName ?? "Unknown",
              job.jobTitle,
              branchDisplay,
              application.resumeUrl ? (
                <button
                  key="resume"
                  onClick={() => handleViewResume(application.resumeUrl)}
                  className="font-semibold text-brand-700 hover:text-brand-900 underline bg-transparent border-none p-0 cursor-pointer text-left"
                >
                  View PDF
                </button>
              ) : (
                <span key="no-resume" className="text-slate-400">No resume</span>
              ),
              <StatusBadge key="status" status={application.status} />,
              <select
                key="update"
                className="input-field min-w-40"
                value={application.status}
                onChange={(event) =>
                  updateApplicationStatus(
                    application.applicationId,
                    event.target.value,
                  )
                }
              >
                {applicationStatuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>,
              <button
                key="details"
                className="btn-secondary"
                onClick={() =>
                  setSelectedApplicationId(application.applicationId)
                }
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Details
              </button>,
            ];
          })}
        />
      </div>
      {selectedApplication && (
        <ApplicationDetailsPanel
          data={data}
          application={selectedApplication}
          close={() => setSelectedApplicationId(null)}
        />
      )}
    </div>
  );
}
function ManagerDashboard({
  data,
  currentUser,
  changePage,
  updateApplicationStatus,
  selectedApplication,
  setSelectedApplicationId,
}) {
  const branch = getBranch(data.branches, currentUser.branchId ?? 0);
  const branchApplications = data.applications.filter(
    (application) =>
      getJob(data.jobs, application.jobId).branchId === currentUser.branchId,
  );
  const selectedBranchApplication =
    selectedApplication &&
    getJob(data.jobs, selectedApplication.jobId).branchId ===
      currentUser.branchId
      ? selectedApplication
      : null;
  return (
    <div className="grid gap-5">
      <PageHeading
        eyebrow="Manager module"
        title={`${branch.branchName} applications`}
        description="Managers only review applications connected to their assigned branch."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Assigned branch"
          value={branch.branchLocation}
          icon={<Building2 className="h-5 w-5" />}
        />
        <StatCard
          label="Applications"
          value={String(branchApplications.length)}
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatCard
          label="Shortlisted"
          value={String(
            branchApplications.filter((item) => item.status === "Shortlisted")
              .length,
          )}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>
      <div className="panel p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoRow label="Manager" value={currentUser.fullName} />
          <InfoRow
            label="Department"
            value={currentUser.department || "Operations"}
          />
          <InfoRow label="Branch address" value={branch.branchAddress} />
          <InfoRow label="Contact" value={branch.contactNo} />
        </div>
      </div>
      <div className="panel overflow-hidden">
        <SectionHeader
          title="Branch application review"
          action={
            <button
              className="btn-secondary"
              onClick={() => changePage("applicationManagement")}
            >
              Open full list
            </button>
          }
        />
        <ResponsiveTable
          headers={["Applicant", "Job", "Status", "Decision", "Details"]}
          rows={branchApplications.map((application) => [
            getUser(data.users, application.applicantId)?.fullName ?? "Unknown",
            getJob(data.jobs, application.jobId).jobTitle,
            <StatusBadge key="status" status={application.status} />,
            <div key="decision" className="flex flex-wrap gap-2">
              <button
                className="btn-secondary"
                onClick={() =>
                  updateApplicationStatus(
                    application.applicationId,
                    "Shortlisted",
                    "Recommended by manager",
                  )
                }
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Shortlist
              </button>
              <button
                className="btn-secondary"
                onClick={() =>
                  updateApplicationStatus(
                    application.applicationId,
                    "Rejected",
                    "Rejected by manager",
                  )
                }
              >
                <XCircle className="h-4 w-4" aria-hidden="true" />
                Reject
              </button>
            </div>,
            <button
              key="details"
              className="btn-secondary"
              onClick={() =>
                setSelectedApplicationId(application.applicationId)
              }
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              View
            </button>,
          ])}
        />
      </div>
      {selectedBranchApplication && (
        <ApplicationDetailsPanel
          data={data}
          application={selectedBranchApplication}
          close={() => setSelectedApplicationId(null)}
        />
      )}
    </div>
  );
}
function NotificationsPage({ data, currentUser, markNotificationsRead }) {
  const notifications = data.notifications.filter(
    (item) => item.applicantId === currentUser.userId,
  );
  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <PageHeading
          eyebrow="Applicant module"
          title="Notifications"
          description="View messages after application submission and status updates."
        />
        <button className="btn-secondary" onClick={markNotificationsRead}>
          Mark all as read
        </button>
      </div>
      <div className="grid gap-3">
        {notifications.length === 0 && (
          <div className="panel p-5 text-sm text-slate-600">
            No notifications yet.
          </div>
        )}
        {notifications.map((notification) => {
          const application = data.applications.find(
            (item) => item.applicationId === notification.applicationId,
          );
          const job = application
            ? getJob(data.jobs, application.jobId)
            : undefined;
          return (
            <article key={notification.notificationId} className="panel p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <span
                    className={`mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-md ${notification.isRead ? "bg-slate-100 text-slate-500" : "bg-brand-50 text-brand-700"}`}
                  >
                    <Bell className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-ink">
                        {notification.notificationType}
                      </h2>
                      {!notification.isRead && (
                        <span className="rounded-full bg-brand-700 px-2 py-0.5 text-xs font-semibold text-white">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {notification.message}
                    </p>
                    {job && (
                      <p className="mt-2 text-xs font-medium text-slate-500">
                        Related job: {job.jobTitle}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  {notification.createdAt}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
function ApplicationDetailsPanel({ data, application, close }) {
  const applicant = getUser(data.users, application.applicantId);
  const job = getJob(data.jobs, application.jobId);
  const branch = getBranch(data.branches, job.branchId);
  return (
    <div className="panel p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Application details</h2>
          <p className="mt-1 text-sm text-slate-500">
            Applicant and job information for review.
          </p>
        </div>
        <button className="btn-secondary" onClick={close}>
          Close
        </button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <InfoRow label="Applicant" value={applicant?.fullName ?? "Unknown"} />
        <InfoRow
          label="Applicant email"
          value={applicant?.email ?? "Unknown"}
        />
        <InfoRow label="Job" value={job.jobTitle} />
        <InfoRow label="Branch" value={branch.branchName} />
        <InfoRow label="Resume" value={application.resumeUrl} />
        <InfoRow label="Status" value={application.status} />
      </div>
      <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-ink">Cover letter</p>
        <p className="mt-1">{application.coverLetter}</p>
        {application.managerComment && (
          <>
            <p className="mt-3 font-semibold text-ink">Manager comment</p>
            <p className="mt-1">{application.managerComment}</p>
          </>
        )}
      </div>
    </div>
  );
}
function JobCard({ job, branches, openJob }) {
  const branch = getBranch(branches, job.branchId);
  return (
    <article className="panel flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink">{job.jobTitle}</h3>
          <p className="mt-1 text-sm text-slate-500">{branch.branchName}</p>
        </div>
        <JobStatusBadge status={job.status} />
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
        {job.jobDescription}
      </p>
      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <InfoPill icon={<MapPin className="h-4 w-4" />} label={job.location} />
        <InfoPill
          icon={<BriefcaseBusiness className="h-4 w-4" />}
          label={job.jobType}
        />
        <InfoPill
          icon={<FileText className="h-4 w-4" />}
          label={`Closing ${job.closingDate}`}
        />
      </div>
      <div className="mt-auto pt-5">
        <button
          className="btn-primary w-full"
          onClick={() => openJob(job.jobId)}
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          View Details
        </button>
      </div>
    </article>
  );
}
function PageHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-sm font-semibold text-brand-700">{eyebrow}</p>
      <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
        {description}
      </p>
    </div>
  );
}
function SectionHeader({ title, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      {action}
    </div>
  );
}
function StatCard({ label, value, icon }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-50 text-brand-700">
          {icon}
        </span>
      </div>
    </div>
  );
}
function StatusBadge({ status }) {
  const styles = {
    Draft: "bg-slate-100 text-slate-700 ring-slate-200",
    Submitted: "bg-sky-50 text-sky-700 ring-sky-200",
    "Under Review": "bg-amber-50 text-amber-800 ring-amber-200",
    Shortlisted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
    Hired: "bg-brand-50 text-brand-700 ring-brand-100",
    "Not Hired": "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles[status]}`}
    >
      {status}
    </span>
  );
}
function JobStatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${status === "Open" ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
}
function ResponsiveTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="whitespace-nowrap px-5 py-3 font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.length === 0 && (
            <tr>
              <td className="px-5 py-4 text-slate-600" colSpan={headers.length}>
                No records found.
              </td>
            </tr>
          )}
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="align-top">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-5 py-4 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
}) {
  return (
    <label className="grid gap-2">
      <span className="label">{label}</span>
      <input
        className="input-field disabled:bg-slate-100 disabled:text-slate-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
      />
    </label>
  );
}
function ErrorBox({ children }) {
  return (
    <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {children}
    </div>
  );
}
function InfoRow({ label, value }) {
  const isUrl = typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"));
  const isStoragePath = typeof value === "string" && value.toLowerCase().endsWith(".pdf") && !isUrl;
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      {isUrl ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-sm font-bold text-brand-700 hover:text-brand-900 underline"
        >
          View PDF Resume
        </a>
      ) : isStoragePath ? (
        <button
          onClick={() => handleViewResume(value)}
          className="mt-1 block text-left text-sm font-bold text-brand-700 hover:text-brand-900 underline bg-transparent border-none p-0 cursor-pointer"
        >
          View PDF Resume
        </button>
      ) : (
        <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
      )}
    </div>
  );
}
function InfoPill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
      <span className="text-brand-700">{icon}</span>
      {label}
    </span>
  );
}
function getBranch(branches, branchId) {
  return branches.find((branch) => branch.branchId === branchId) ?? branches[0];
}
function getJob(jobs, jobId) {
  return jobs.find((job) => job.jobId === jobId) ?? jobs[0];
}
function getUser(users, userId) {
  return users.find((user) => user.userId === userId);
}
export default App;

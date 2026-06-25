# Project Report

Faculty of Information Science & Technology  
TSE6223 Software Engineering Fundamentals  
Trimester March/April 2026

Title: Job Application System  
Project: Etiqa Trade Sdn Bhd Job Application System

| Student ID | Student Name | Programme |
| --- | --- | --- |
| [TO CONFIRM] | [TO CONFIRM] | [TO CONFIRM] |
| [TO CONFIRM] | [TO CONFIRM] | [TO CONFIRM] |
| [TO CONFIRM] | [TO CONFIRM] | [TO CONFIRM] |
| [TO CONFIRM] | [TO CONFIRM] | [TO CONFIRM] |

[Fill in group member details]

\pagebreak

# Declaration Page

[Insert project declaration form]

[Insert AI usage declaration]

[Insert similarity index report]

\pagebreak

# Table of Contents

[Generated table of contents to be updated in Microsoft Word]

1. Introduction
2. Background Study
3. Requirements Engineering
4. Functional and Non-Functional Requirements
5. Requirements Modelling
6. Design Modelling
7. Testing
8. Project Management
9. Conclusion
10. References
11. AI Usage Declaration Draft
Remaining Work Checklist

\pagebreak

# 1. Introduction

## 1.1 Project Overview
The Job Application System is a web-based system proposed for Etiqa Trade Sdn Bhd, a fictional company with multiple branches across Malaysia. The system aims to help the company manage job vacancies and job applications in one centralised platform.

The main users are Applicant, HR/Admin, and Manager. Applicants can view job openings, submit applications, provide resume information, and check application status. HR/Admin users can manage job postings and applications. Managers can review applications for their assigned branch.

The current implementation is a frontend prototype built using React, Vite, TypeScript, and Tailwind CSS. It uses browser localStorage as demo storage. No real backend server or database is connected yet.

## 1.2 Problem Statement
The current job application process can become inefficient when applications are handled manually or separately by different branches. Applicants may not have a simple way to view vacancies, submit resumes, or track application status. HR staff may also face difficulty managing job postings, filtering applicants, and updating application progress across multiple branches.

## 1.3 Objectives
- Build a centralised job application system.
- Allow applicants to apply online without visiting a branch physically.
- Allow HR/Admin users to manage job postings and applications from one dashboard.
- Support multiple company branches across Malaysia.
- Reduce manual workload and hiring time.
- Improve application tracking and status updates.

## 1.4 Significance of the System
The system is significant because it can help organise recruitment activities in one place. It supports applicants by giving them a clearer application process, and it supports HR/Admin and Managers by improving tracking, filtering, and status updates. [TO CONFIRM if additional business benefits are required]

# 2. Background Study

Job application systems are commonly used to help organisations advertise vacancies, receive applications, store applicant information, and track recruitment progress. For companies with several branches, a centralised system can reduce confusion because all job postings and applications can be viewed in one place.

In a current or manual application process, applicants may need to send resumes through email, messaging apps, or physical forms. HR staff may need to manually collect documents, update spreadsheets, and inform applicants about their application status. This can make tracking difficult, especially when different branches receive different applications.

Manual or scattered tracking may cause duplicated applications, missing resumes, late status updates, and difficulty comparing candidates. It may also be hard for managers to review only the applications that belong to their branch.

The proposed system improves the process by allowing applicants to view job postings, submit applications online, and check status. HR/Admin users can create job postings, filter applications, and update status. Managers can review branch-related applications only. This supports a more organised recruitment workflow.

[Member responsible to review/expand background study]

# 3. Requirements Engineering

## 3.1 Inception
The team identified the main problem, project goals, stakeholders, and system scope based on the Job Application System project title and the expected recruitment workflow. The main stakeholders are Applicants, HR/Admin staff, Branch Managers, and company management.

## 3.2 Elicitation
Requirements were gathered from the assignment scenario, group discussion, Notion project notes, prototype review, and comparison with common job application system features. No formal interview or survey was conducted, so the report treats these requirements as project-scenario and prototype-based requirements.

## 3.3 Elaboration
The requirements were refined into Applicant, HR/Admin, and Manager modules. Functional requirements, non-functional requirements, use cases, and main classes/entities were prepared.

## 3.4 Negotiation
Some features were prioritised due to time and project scope. In-system notifications were kept first, while email notification was moved to future enhancement. Editing submitted applications was also treated as future enhancement.

## 3.5 Specification
The requirements were documented using requirement IDs such as FR01 to FR19, NFR01 to NFR10, and UC01 to UC18. These are included in the report sections below.

## 3.6 Validation
Requirements were validated through prototype review and manual functional testing. The team checked whether the main users can complete important workflows such as registration, login, job viewing, application submission, duplicate application prevention, status update, notification viewing, and manager branch review.

## 3.7 Requirements Management
Requirement IDs are used to keep the report, diagrams, implementation, and testing evidence aligned. Items that are not implemented in the frontend prototype, such as real file upload, backend database storage, email notification, HTTPS deployment, session timeout, and separate admin user management, are documented as future enhancements or full-system requirements instead of being claimed as completed prototype features.

# 4. Functional and Non-Functional Requirements

## 4.1 Functional Requirements
| ID | Functional Requirement |
| --- | --- |
| FR01 | The system shall allow applicants to register an account. |
| FR02 | The system shall allow applicants to log in. |
| FR03 | The system shall allow applicants to view available job vacancies. |
| FR04 | The system shall allow applicants to view detailed job information. |
| FR05 | The system shall allow applicants to submit job applications online. |
| FR06 | The system shall allow applicants to provide resume information or a resume filename in the prototype. |
| FR07 | The system shall allow applicants to view application status. |
| FR08 | The system shall notify applicants when status is updated. Current prototype supports in-system notifications. |
| FR09 | The system shall allow HR/Admin users to log in. |
| FR10 | The system shall allow HR/Admin users to create job postings. |
| FR11 | The system shall allow HR/Admin users to edit job postings. |
| FR12 | The system shall allow HR/Admin users to close job postings. |
| FR13 | The system shall allow HR/Admin users to view submitted applications. |
| FR14 | The system shall allow HR/Admin users to filter applications. |
| FR15 | The system shall allow HR/Admin users to update application status. |
| FR16 | The system shall allow managers to view branch-related applications. |
| FR17 | The system shall allow managers to approve, reject, or shortlist applications. Current prototype supports shortlist/reject and status updates. |
| FR18 | The system shall support multiple company branches. |
| FR19 | The system shall store application records for tracking. |

Future full-system requirements include separate admin user account management, real resume file upload/storage, email notification, and backend database integration. These are not claimed as completed frontend prototype features.

## 4.2 Non-Functional Requirements
| ID | Non-Functional Requirement |
| --- | --- |
| NFR01 | The system shall be accessible through common web browsers. |
| NFR02 | The system shall have a responsive user interface. |
| NFR03 | The system shall use clear navigation, forms, buttons, and status badges to support usability. |
| NFR04 | The system shall provide clear error or notice messages for invalid login, invalid registration, incomplete application, duplicate application, and status updates. |
| NFR05 | The system shall restrict page access based on user role in the frontend prototype. |
| NFR06 | The system shall store demo data persistently in the browser using localStorage during prototype testing. |
| NFR07 | The system shall support multiple branches of Etiqa Trade Sdn Bhd in job posting and application filtering. |
| NFR08 | The system shall keep the user interface consistent across Applicant, HR/Admin, and Manager modules. |
| NFR09 | The system shall separate the planned presentation layer, business logic layer, and data layer in the full system design. |
| NFR10 | The full deployed system should use secure backend storage, password protection, HTTPS, and session management. These are future full-system requirements and are not implemented in the current frontend prototype. |

# 5. Requirements Modelling

## 5.1 Actors and Responsibilities
| Actor | Responsibilities |
| --- | --- |
| Applicant | Views jobs, registers, logs in, submits applications, provides resume information or a resume filename, checks status, and views notifications. |
| HR/Admin | Creates, edits, and closes job postings; views and filters applications; updates application status. Separate user account management is a future enhancement. |
| Manager | Views applications for assigned branch only and shortlists, rejects, or reviews applications. |

## 5.2 Use Case Diagram
The use case model includes Applicant, HR/Admin, and Manager functions. The Notion export previously contained a use case diagram image file.

Figure 5.1(a): Use Case Diagram - Part 1

![Use Case Diagram Part 1](diagrams/use-case-diagram-part-1-light.png)

Figure 5.1(b): Use Case Diagram - Part 2

![Use Case Diagram Part 2](diagrams/use-case-diagram-part-2-light.png)

Figure 5.1(c): Use Case Diagram - Part 3

![Use Case Diagram Part 3](diagrams/use-case-diagram-part-3-light.png)

Figure 5.1(d): Use Case Diagram - Part 4

![Use Case Diagram Part 4](diagrams/use-case-diagram-part-4-light.png)
## 5.3 Use Case Descriptions
| ID | Use Case | Actor |
| --- | --- | --- |
| UC01 | Register Account | Applicant |
| UC02 | Login | Applicant, HR/Admin, Manager |
| UC03 | View Job Vacancies | Applicant |
| UC04 | View Job Details | Applicant |
| UC05 | Submit Job Application | Applicant |
| UC06 | Provide Resume Information | Applicant |
| UC07 | View Application Status | Applicant |
| UC08 | Receive Notification | Applicant |
| UC09 | Create Job Posting | HR/Admin |
| UC10 | Edit Job Posting | HR/Admin |
| UC11 | Close Job Posting | HR/Admin |
| UC12 | View Applications | HR/Admin |
| UC13 | Filter Applications | HR/Admin |
| UC14 | Update Application Status | HR/Admin |
| UC15 | Manage User Accounts | HR/Admin |
| UC16 | View Branch Applications | Manager |
| UC17 | Review Application | Manager |
| UC18 | Approve / Reject Application | Manager |

## 5.4 Class Diagram / ERD
The class and ERD modelling identifies the main data entities used by the Job Application System. The current React prototype stores these records in browser localStorage, while the final ERD can be used as the basis for a future backend database.

| Entity / Class | Main Fields Mentioned |
| --- | --- |
| Applicant | applicantId, fullName, email, passwordHash, phoneNo, address, resumeUrl, dateRegistered |
| Admin | adminId, fullName, email, passwordHash, role |
| Manager | managerId, branchId, fullName, email, passwordHash, department |
| Branch | branchId, branchName, branchLocation, branchAddress, contactNo |
| JobPosting | jobId, branchId, adminId, jobTitle, jobDescription, jobType, location, salaryRange, requirements, postedDate, closingDate, status |
| JobApplication | applicationId, applicantId, jobId, applicationDate, coverLetter, resumeUrl, status, lastUpdated |
| Notification | notificationId, applicantId, applicationId, message, notificationType, isRead, createdAt |

Figure 5.2: Analysis Class Diagram

![Analysis Class Diagram](diagrams/analysis-class-diagram-light.png)

Figure 5.3: Refined Class Diagram

![Refined Class Diagram](diagrams/refined-class-diagram-light.png)

Figure 5.4: Final ERD

![Final ERD](diagrams/final-erd-diagram.png)

## 5.5 Sequence Diagram
The sequence diagram below shows the applicant job application submission flow. It starts when an applicant opens a job, submits the application form, and the frontend validates the input before saving the application and notification records into localStorage.

Figure 5.5: Sequence Diagram for Applicant Job Application Submission

![Sequence Diagram for Applicant Job Application Submission](diagrams/sequence-diagram-application-submission.png)

## 5.6 State Diagram
The state diagram below shows the intended status lifecycle for a job application. The current prototype allows HR/Admin users to update statuses through a dropdown, while the diagram represents the expected recruitment process flow.

Figure 5.6: State Diagram for Job Application Status

![State Diagram for Job Application Status](diagrams/state-diagram-application-status.png)

## 5.7 DFD Context Diagram
The context diagram shows the Job Application System as one process interacting with three external users: Applicant, HR/Admin, and Manager.

Figure 5.7: DFD Context Diagram

![DFD Context Diagram](diagrams/dfd-context-diagram.png)

## 5.8 DFD Level 1
The Level 1 DFD breaks the system into five major processes: user account and login, job posting management, application submission, application review and status update, and notification handling. The data stores shown are the logical stores represented by localStorage in the current prototype.

Figure 5.8: DFD Level 1

![DFD Level 1](diagrams/dfd-level-1-diagram.png)

# 6. Design Modelling

## 6.1 Data/Class Design
The data/class design is based on Applicant, Admin, Manager, Branch, JobPosting, JobApplication, and Notification. The frontend currently represents Applicant, HR/Admin, and Manager using a shared User type with a role field. This is acceptable for the prototype but the final backend schema is [TO CONFIRM].

Main relationships:
- One applicant can submit many job applications.
- One job posting can receive many job applications.
- One branch can contain many job postings.
- One branch can be assigned to many managers.
- Managers review applications for their assigned branch.
- Job applications can trigger notifications.

## 6.2 Data Dictionary
[Insert Data Dictionary]

| Data Item | Description | Current Status |
| --- | --- | --- |
| User / Applicant / Admin / Manager | Stores demo account information and role. Current frontend uses one User type with role field. | Frontend implemented; backend schema [TO CONFIRM]. |
| Branch | Stores branch name, location, address, and contact number. | Sample branches: Kuala Lumpur, Penang, Johor. |
| JobPosting | Stores job vacancy information shown to applicants and managed by HR/Admin. | Implemented in frontend localStorage. |
| JobApplication | Stores submitted application, cover letter, resume filename, status, and update date. | Implemented in frontend localStorage. |
| Notification | Stores in-system notification messages for application submission and status update. | Implemented in frontend localStorage. |

## 6.3 Architecture Design
The planned architecture is a three-tier client-server architecture with Presentation Layer, Application / Business Logic Layer, and Data Layer. For the current prototype, the architecture is simplified because the application is frontend-only. UI, simple logic, and demo data are handled inside the React application and browser localStorage.

Figure 6.1: System Architecture Diagram

![System Architecture Diagram](diagrams/architecture-diagram-light.png)

[Backend member to add backend architecture/API explanation]

## 6.4 UI/UX Design
The UI/UX design uses a clean web application layout for Applicant, HR/Admin, and Manager users. Main screens include Login, Register, Job Listing, Job Details/Application, Applicant Dashboard, HR/Admin Dashboard, Job Management, Application Management, Manager Dashboard, and Notifications.

The screenshots below show the implemented frontend prototype. The interface uses a consistent navigation bar, role-based side menu, card layout, status badges, data tables, and simple form controls to support the main recruitment workflows.

Figure 6.2: Login Page

![Login Page](ui-screenshots/figure-6-2-login-page.png)

Figure 6.3: Register Page

![Register Page](ui-screenshots/figure-6-3-register-page.png)

Figure 6.4: Job Listing Page

![Job Listing Page](ui-screenshots/figure-6-4-job-listing-page.png)

Figure 6.5: Job Details/Application Page

![Job Details/Application Page](ui-screenshots/figure-6-5-job-details-application-page.png)

Figure 6.6: Applicant Dashboard

![Applicant Dashboard](ui-screenshots/figure-6-6-applicant-dashboard.png)

Figure 6.7: Notifications Page

![Notifications Page](ui-screenshots/figure-6-7-notifications-page.png)

Figure 6.8: HR/Admin Dashboard

![HR/Admin Dashboard](ui-screenshots/figure-6-8-hr-admin-dashboard.png)

Figure 6.9: Job Management Page

![Job Management Page](ui-screenshots/figure-6-9-job-management-page.png)

Figure 6.10: Application Management Page

![Application Management Page](ui-screenshots/figure-6-10-application-management-page.png)

Figure 6.11: Manager Dashboard

![Manager Dashboard](ui-screenshots/figure-6-11-manager-dashboard.png)

## 6.5 Component-Level Design
The selected component is Applicant Job Application Submission. This component handles job selection, application form input, resume information, validation, application saving, and notification creation.

Figure 6.12: Component-Level Flowchart for Applicant Job Application Submission

![Component-Level Flowchart for Applicant Job Application Submission](diagrams/component-flowchart-application-submission.png)

# 7. Testing

## 7.1 Testing Objective
The objective of testing is to check whether the Job Application System works according to the main functional requirements for Applicant, HR/Admin, and Manager users. The current testing evidence is based on manual functional testing of the React frontend prototype. The report does not claim that backend, database, deployment, or automated unit testing has been completed.

## 7.2 Testing Strategy
Testing focuses on important user workflows, role-based access, validation messages, application submission, status updates, notifications, and browser localStorage persistence. Since the current system is frontend-only, backend integration testing, database testing, real file-upload testing, and security testing are still pending.

## 7.3 Functions / Modules to Be Tested
| Module | Function / Module | Main User |
| --- | --- | --- |
| M01 | User Login | Applicant, HR/Admin, Manager |
| M02 | Applicant Registration | Applicant |
| M03 | Job Listing and Job Details | Applicant, Public User |
| M04 | Application Submission | Applicant |
| M05 | Applicant Dashboard and Status View | Applicant |
| M06 | Job Posting Management | HR/Admin |
| M07 | Application Filtering and Management | HR/Admin |
| M08 | Application Status Update | HR/Admin, Manager |
| M09 | Notification Creation and Display | Applicant |
| M10 | Manager Branch Application Review | Manager |

## 7.4 Testing Techniques
- Black-box testing
- Manual functional testing
- Smoke testing
- Input validation testing
- Negative testing
- Error guessing
- Authorization testing
- Basic regression testing

## 7.5 Manual Test Case Results
| Test Case ID | Description | Test Steps | Test Data/Input | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- |
| TC01 | Applicant registration form validation | Open Register page; leave required fields incomplete or enter invalid input; submit. | Missing name/email/password or invalid email | Error message is displayed and account is not created. | Registration validation message was displayed. | Passed |
| TC02 | Successful applicant registration | Open Register page; enter valid applicant details; submit. | Valid name, email, password, confirm password, and optional resume filename | New applicant account is created and user is redirected to applicant dashboard. | Applicant dashboard was displayed after registration. | Passed |
| TC03 | Valid login | Open Login page; enter a valid demo account; click Login. | applicant@test.com / password123, admin@etiqatrade.com / password123, or manager.kl@etiqatrade.com / password123 | User is redirected to the correct dashboard based on role. | Correct dashboard was displayed after login. | Passed |
| TC04 | Invalid login | Open Login page; enter wrong email or password; click Login. | Incorrect email/password combination | Invalid login message is displayed and user remains unauthenticated. | Invalid email or password message was displayed. | Passed |
| TC05 | View job vacancies and job details | Open job listing; select a job vacancy. | Existing demo job posting | Job list and selected job details are displayed. | Available job vacancies and job details were displayed. | Passed |
| TC06 | Submit job application | Login as applicant; open job details; enter cover letter and resume filename; submit. | Cover letter and resume filename | Application is saved with Submitted status and an in-system notification is created. | Application was submitted and appeared in the applicant dashboard. | Passed |
| TC07 | Duplicate application prevention | Login as applicant; try to apply for the same job more than once. | Same applicant and same job posting | System rejects the second application attempt. | Duplicate application message was displayed. | Passed |
| TC08 | Applicant status tracking | Login as applicant; open applicant dashboard. | Existing submitted applications | Applicant can view submitted applications and current statuses. | Application statuses were displayed in the applicant dashboard. | Passed |
| TC09 | HR/Admin job posting management | Login as HR/Admin; create or edit a job posting. | Job title, branch, type, salary, requirements, closing date, status | Job posting is saved and appears in the job management list. | Job posting management screen showed the new/updated job information. | Passed |
| TC10 | HR/Admin application status update | Login as HR/Admin; open application management; change application status. | Status such as Shortlisted or Under Review | Application status is updated and applicant notification is created. | Status dropdown updated the application status. | Passed |
| TC11 | Manager branch application review | Login as Manager; open manager dashboard; shortlist or reject an application. | manager.kl@etiqatrade.com / password123 | Manager can view assigned branch applications and make shortlist/reject decisions. | Manager dashboard displayed branch applications and decision buttons. | Passed |

## 7.6 Actual Results
Manual functional testing shows that the main frontend workflows are working for the prototype. Applicant registration, login, job viewing, job application submission, duplicate application prevention, applicant status tracking, HR/Admin job posting management, HR/Admin application status update, and Manager branch review were successfully demonstrated using screenshots.

The screenshots should be inserted as testing evidence using corrected captions:

Figure 7.1: Applicant registration page

![Applicant registration page](testing-screenshots/figure-7-1-applicant-registration.png)

Figure 7.2: Successful registration redirects to applicant dashboard

![Successful registration redirects to applicant dashboard](testing-screenshots/figure-7-2-successful-registration.png)

Figure 7.3: Registration validation message for invalid or incomplete input

![Registration validation message for invalid or incomplete input](testing-screenshots/figure-7-3-registration-validation.png)

Figure 7.4: Login page

![Login page](testing-screenshots/figure-7-4-login-page.png)

Figure 7.5: Successful applicant login dashboard

![Successful applicant login dashboard](testing-screenshots/figure-7-5-successful-login.png)

Figure 7.6: Invalid login error message

![Invalid login error message](testing-screenshots/figure-7-6-invalid-login.png)

Figure 7.7: Available job vacancies

![Available job vacancies](testing-screenshots/figure-7-7-job-vacancies.png)

Figure 7.8: Job application form

![Job application form](testing-screenshots/figure-7-8-job-application-form.jpeg)

Figure 7.9: Application submitted successfully

![Application submitted successfully](testing-screenshots/figure-7-9-application-submitted.jpeg)

Figure 7.10: Duplicate application prevention message

![Duplicate application prevention message](testing-screenshots/figure-7-10-duplicate-application.jpeg)

Figure 7.11: Applicant dashboard showing application status

![Applicant dashboard showing application status](testing-screenshots/figure-7-11-application-status.png)

Figure 7.12: HR/Admin dashboard

![HR/Admin dashboard](testing-screenshots/figure-7-12-hr-dashboard.png)

Figure 7.13: HR/Admin job posting management

![HR/Admin job posting management](testing-screenshots/figure-7-13-job-management.png)

Figure 7.14: Job posting created or updated successfully

![Job posting created or updated successfully](testing-screenshots/figure-7-14-job-posting-created.png)

Figure 7.15: HR/Admin application status update

![HR/Admin application status update](testing-screenshots/figure-7-15-status-update.png)

Figure 7.16: Manager branch application review and shortlist/reject decision

![Manager branch application review and shortlist/reject decision](testing-screenshots/figure-7-16-manager-review.png)

Note: The resume evidence screenshot from the original testing document was not inserted because the current prototype records a resume filename only and does not implement real file upload.

## 7.7 Testing Limitations
- The current testing is manual and screenshot-based. Automated unit tests and automated end-to-end tests have not been added yet.
- The prototype stores data in browser localStorage, so database testing and backend API testing are not applicable yet.
- Resume handling is tested as a resume filename field only. Real file upload, file type validation, and file storage are not implemented yet.
- Security testing is limited to basic role-based page access. Password hashing, HTTPS, server-side authorization, and session timeout still require backend/deployment implementation.
- Performance, availability, and cross-browser compatibility testing are still pending final verification.

# 8. Project Management

## 8.1 Project Management Approach
The project uses the Waterfall Model because the assignment has clear academic deliverables, fixed phases, and a final deadline. The phases are requirements analysis, system design, implementation, testing, and final submission.

The Waterfall Model is suitable for this project because the team can complete the report and system according to the required university project sections. Each phase produces an output before the next phase continues.

[Project manager/member to verify process model]

## 8.2 Project Scope
The project scope is based on the scope described in the Introduction chapter. The system focuses on job posting, applicant registration/login, job application submission, application status tracking, HR/Admin job and application management, manager branch application review, and in-system notifications.

Items included in the current prototype:
- Applicant registration and login
- Job listing and job details
- Job application submission
- Applicant dashboard and application status tracking
- HR/Admin dashboard
- Job posting management
- Application filtering and status update
- Manager branch-based application review
- In-system notifications

Items not included or still pending:
- Real backend integration [Backend member to complete]
- Real database server [Backend member to complete]
- Real resume file upload [Future enhancement]
- Email notification [Future enhancement]
- Separate admin user account management screen [Future enhancement]
- Final deployment with HTTPS [Future deployment requirement]

## 8.3 Project Scheduling
The project schedule follows the Waterfall phases. A final Gantt chart or project management tool screenshot should be inserted after the table.

| Week | Waterfall Phase | Main Activities | Deliverable / Evidence | Status |
| --- | --- | --- | --- | --- |
| Week 5 | Requirements Analysis | Identify problem, stakeholders, scope, FR, and NFR | Requirements notes and report draft | [Status to confirm] |
| Week 7 | Requirements Modelling | Prepare use cases and class modelling | Use case list and class diagram | [Status to confirm] |
| Week 9 | Design Modelling | Prepare architecture, data design, UI/UX, and component design | Design documentation and diagrams | [Status to confirm] |
| Week 10-11 | Development | Build frontend prototype and backend components | Source code and demo system | [Backend integration pending] |
| Week 12 | Testing | Prepare and run test cases, record defects and results | Test case table and screenshots | [Final results pending] |
| Final Week | Delivery | Prepare final report, source code, slides, and video | Final submission package | [Pending] |

[Insert timeline/Gantt chart]

[Insert screenshot of Notion/Trello/Jira schedule if available]

## 8.4 Progress Monitoring
Project progress was monitored using task lists, document updates, and team communication. The team used Notion as a project dashboard and OneDrive/shared folder for files. GitHub or other version control evidence is [TO CONFIRM].

Progress monitoring methods:
- Milestone completion tracking
- Task assignment and completion checking
- Weekly or regular project discussion [TO CONFIRM]
- Report section progress checking
- Source code progress checking
- Testing progress checking

Evidence to insert:
- [Insert Notion progress tracker screenshot]
- [Insert task assignment/completion screenshot]
- [Insert meeting minutes or discussion notes]
- [Insert GitHub commit/history screenshot if available]
- [Insert progress report evidence if available]

## 8.5 Team Roles and Collaboration
| Role | Responsibility | Assigned Member |
| --- | --- | --- |
| Project Manager / Leader | Coordinate work, assign tasks, manage timeline, compile report. | [TO CONFIRM member name] |
| Backend Developer | Authentication, database, server-side logic, API, application processing. | [Backend member to add backend task progress] |
| Frontend Developer | User interface for Applicant, HR/Admin, and Manager. | [Frontend member to verify UI/UX explanation] |
| Tester / Documentation Lead | Test cases, test results, report support, final checking. | [Tester to add testing task progress] |

Work allocation:
| Task Area | Member | Progress / Evidence |
| --- | --- | --- |
| Requirements and report compilation | [TO CONFIRM] | [Insert task distribution screenshot] |
| Frontend implementation | [TO CONFIRM] | React/Vite frontend prototype created. |
| Backend implementation | [TO CONFIRM] | [Backend member to add backend task progress] |
| Testing | [TO CONFIRM] | [Tester to add testing task progress] |
| Presentation slides/video | [TO CONFIRM] | [TO CONFIRM] |

Communication and collaboration tools:
- Notion: project notes, requirements, progress tracking, and draft documentation
- WhatsApp/Discord/Microsoft Teams: team discussion [TO CONFIRM exact tool]
- OneDrive/Google Drive: file sharing [TO CONFIRM]
- GitHub: source code version control [TO CONFIRM if used]
- Google Meet/Microsoft Teams: online meetings [TO CONFIRM if used]

Evidence to insert:
- [Insert task distribution screenshot]
- [Insert meeting/WhatsApp/Notion/GitHub evidence]
- [Backend member to add backend task progress]
- [Tester to add testing task progress]

## 8.6 Risk Management
| Risk ID | Risk | Probability | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| R01 | Backend integration may not be completed on time. | High | High | Keep frontend prototype working and document backend as pending. | [TO CONFIRM owner] |
| R02 | Testing evidence may be incomplete before deadline. | Medium | High | Prepare test case table early and capture screenshots during final testing. | [Tester] |
| R03 | Missing diagrams or screenshots may reduce report completeness. | Medium | Medium | Use placeholders now and insert final images before submission. | [All members] |
| R04 | Similarity index may exceed allowed percentage. | Low | High | Paraphrase properly, cite sources, and review Turnitin/similarity result. | [Leader] |
| R05 | Team member may be unavailable near submission date. | Medium | Medium | Share files early and assign backup members for important sections. | [TO CONFIRM owner] |
| R06 | Requirement changes may affect completed work. | Low | Medium | Keep changes small and update report, diagrams, and test cases together. | [Leader] |

## 8.7 Project Estimation and Budget Planning
This section is added based on Lab 11 project management requirements. The estimation and budget are still draft values and must be checked by the project manager/member.

### 8.7.1 Effort Estimation
The team can estimate project effort using person-hours. Since this is a student project, the cost can be shown as estimated effort instead of real salary cost.

| Activity | Estimated Hours | Member / Role | Status |
| --- | --- | --- | --- |
| Requirements and documentation | [TO CONFIRM] | Leader / Documentation | [Pending verification] |
| UI/UX and frontend development | [TO CONFIRM] | Frontend Developer | [Pending verification] |
| Backend development | [TO CONFIRM] | Backend Developer | [Backend integration pending] |
| Testing and bug fixing | [TO CONFIRM] | Tester | [Final testing pending] |
| Report formatting and final checking | [TO CONFIRM] | All members | [Pending] |
| Presentation slides and video | [TO CONFIRM] | All members | [Pending] |

[Insert LOC or Function Point estimation calculation if required by lecturer]

[Member to confirm whether LOC or FP approach will be used]

### 8.7.2 Budget Planning
The project mostly uses free or student-accessible tools. The final budget should be confirmed before submission.

| Cost Item | Tool / Resource | Estimated Cost | Notes |
| --- | --- | --- | --- |
| Development tools | VS Code, React, Vite, TypeScript, Tailwind CSS | RM0 | Free/open-source tools |
| Project management | Notion / Trello / Jira | RM0 / [TO CONFIRM] | Free plan expected |
| Communication | WhatsApp / Discord / Google Meet / Microsoft Teams | RM0 / [TO CONFIRM] | Depends on tool used |
| File sharing | OneDrive / Google Drive | RM0 / [TO CONFIRM] | Student account or free plan |
| Hosting/deployment | [TO CONFIRM] | [TO CONFIRM] | Only needed if final deployment is required |
| APIs/email service | [TO CONFIRM] | [TO CONFIRM] | Email notification is future enhancement |
| Miscellaneous | Printing, internet, recording tools | [TO CONFIRM] | Add if used |

[Project manager/member to verify estimation and budget plan]

# 9. Conclusion

The Job Application System is designed to support a more centralised recruitment process for Etiqa Trade Sdn Bhd. The system aims to centralise job posting, application submission, application review, and status tracking.

At the current stage, the frontend prototype demonstrates the main workflows for applicants, HR/Admin users, and managers. Further work is still needed before final submission, especially backend integration, final testing evidence, screenshots, diagrams, and final proofreading.

[Update after final system integration and testing]

# 10. References

1. TSE6223 Software Engineering Fundamentals Project Guidelines. [Add full reference details]
2. Project Notion export, Etiqa Trade Sdn Bhd Job Application System notes. [Add access date if needed]
3. React documentation. [TO CONFIRM final citation]
4. Vite documentation. [TO CONFIRM final citation]
5. TypeScript documentation. [TO CONFIRM final citation]
6. Tailwind CSS documentation. [TO CONFIRM final citation]
7. Software engineering textbook / lecture notes. [TO CONFIRM]
8. Testing techniques reference. [TO CONFIRM]

[Add references used for background study, UI/UX, software engineering concepts, testing techniques]

# 11. AI Usage Declaration Draft

AI was used to assist with understanding requirements, generating initial code drafts, structuring documentation, debugging, and preparing report templates.

The team reviewed, edited, and verified the work. The team is responsible for checking the accuracy of the final report, source code, screenshots, testing evidence, and presentation materials.

Final decisions, screenshots, testing evidence, and project content are the responsibility of the team.

# Remaining Work Checklist
- [ ] Backend integration pending
- [ ] Final testing results pending
- [x] UI and testing screenshots inserted
- [x] Main diagrams inserted
- [ ] Member details pending
- [ ] Similarity index report pending
- [ ] Presentation slides pending
- [ ] Presentation video pending
- [ ] Final proofreading pending

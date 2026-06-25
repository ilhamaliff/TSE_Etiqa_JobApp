# Etiqa Trade Job Application System

A simple React frontend prototype for a job application management system.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js
- npm
- Git

You can check whether they are installed by running:

```powershell
node -v
npm -v
git --version
```

## How To Run The Program

### 1. Clone the repository

Open a terminal or PowerShell, then run:

```powershell
git clone https://github.com/ilhamaliff/TSE_Etiqa_JobApp.git
```

### 2. Go into the project folder

```powershell
cd TSE_Etiqa_JobApp
```

### 3. Install the project dependencies

```powershell
npm install
```

This will install all packages needed by the project, including React, Vite, and Tailwind CSS.

### 4. Start the development server

```powershell
npm run dev
```

### 5. Open the program in your browser

After running the command, the terminal will show a local development URL, usually:

```text
http://localhost:5173
```

Open that link in your browser to use the system.

## Demo Accounts

Use one of the following demo accounts to log in and test the system:

| Role | Email | Password |
| --- | --- | --- |
| Applicant | applicant@test.com | password123 |
| HR/Admin | admin@etiqatrade.com | password123 |
| Manager | manager.kl@etiqatrade.com | password123 |

## Build For Production

To create a production-ready build, run:

```powershell
npm run build
```

The generated files will be placed inside the `dist` folder.

## Preview The Production Build

After building the project, you can preview it locally with:

```powershell
npm run preview
```

Then open the local preview URL shown in the terminal.

## Troubleshooting

### `npm` is not recognized

Install Node.js, then close and reopen your terminal before trying again.

### Port already in use

If `http://localhost:5173` is already being used, Vite may automatically use another port such as:

```text
http://localhost:5174
```

Open the URL shown in your terminal.

### Dependencies are not working correctly

Try deleting `node_modules` and `package-lock.json`, then reinstall the dependencies:

```powershell
rm -r node_modules
rm package-lock.json
npm install
```

On Windows PowerShell, if the command above does not work, use:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## Note

This version stores demo data in browser localStorage. A real backend/database can be connected later by replacing the localStorage data functions in `src/App.jsx`.

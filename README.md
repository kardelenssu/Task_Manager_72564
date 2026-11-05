# Task Manager — Team Project (IT) ,,

**Student:** Kardelen Su Kurt  
**Student ID:** 72564  
**Course:** Team Project – IT

## Project overview

Task Manager is a simple web application built with HTML, CSS, and JavaScript. It uses the Supabase PostgreSQL REST API to store tasks persistently and is designed to run on GitHub Pages without a separate backend server or user login.

## Project links

- **GitHub repository:** https://github.com/kardelenssu/vistula-task-manager
- **Application URL :** https://kardelenssu.github.io/vistula-task-manager/
- **Contribution page :** https://kardelenssu.github.io/vistula-task-manager/contribution.html
- **Contribution JSON :** https://kardelenssu.github.io/vistula-task-manager/contribution.json



## Features

- Display all saved tasks
- Add tasks with a required title and optional description
- Edit existing tasks
- Mark tasks completed or incomplete
- Delete tasks
- Persist changes in the database after refreshing
- Show a teammate's student ID via a separate contributor page
- Display status and error messages

## Technology stack

- HTML, CSS, JavaScript (frontend)
- Supabase PostgreSQL (database)
- Supabase auto-generated REST API (CRUD operations)
- Git, GitHub, and GitHub Pages (version control and hosting)

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Main Task Manager page and required HTML elements |
| `app.js` | Task operations and Supabase REST requests |
| `style.css` | Application styling |
| `config.json` | Public Supabase URL, publishable API key, and `tasks` table name |
| `contribution.html` | Team contributor page |
| `contribution.json` | ID of the student contributing to this repository |
| `README.md` | Documentation and collaboration evidence |

## Supabase database

A **separate demonstration project** named **Vistula Task Manager 72564** has been created in student 73195's Supabase organization. It is separate from student 73195's own Task Manager database.

- **Project dashboard:** https://supabase.com/dashboard/project/srztimmmafjkxfxiizlv
- **Project URL:** https://srztimmmafjkxfxiizlv.supabase.co
- **REST endpoint:** `https://srztimmmafjkxfxiizlv.supabase.co/rest/v1/tasks`
- **Database table:** `tasks`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | BIGINT | Auto-generated primary key |
| `title` | TEXT | Required |
| `description` | TEXT | Optional |
| `completed` | BOOLEAN | Defaults to `false` |

The `tasks` table has been created with Row Level Security (RLS) enabled and demonstration policies permitting public `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. Database-level insert, update, and delete tests passed, and the temporary test row was removed. **The deployed website and browser API requests must still be verified.**

The supplied project package includes `config.json` containing this project's URL and its **public publishable key**. Only publishable keys may be included in frontend code; never publish secret keys, service-role keys, or passwords.

**Security note:** This database is intentionally publicly writable to meet the assignment. Do not store private or sensitive data.

## Run locally

1. Open a terminal in the folder containing `index.html` and `config.json`.
2. Start a local server:

   ```bash
   python -m http.server 8000
   ```

3. Open http://localhost:8000/ in your browser.
4. Try adding, editing, toggling, deleting and refreshing tasks.

## Deploy using GitHub Pages

1. Upload the project files from the **Supabase-connected** ZIP into the repository root (not into an additional nested folder).
2. In GitHub, open **Settings → Pages**.
3. Select **Deploy from a branch**, branch **main**, directory **/(root)** and save.
4. Open the published application URL and confirm that all task operations work and persist after refresh.
5. Confirm that `contribution.html` loads the student ID from `contribution.json`.

## Team collaboration — Pull Requests

- **Repository owner:** Kardelen Su Kurt — **72564**
- **Partner:** Student ID **73195**
- **Partner's repository:** https://github.com/vistula-team-project-73195/vistula-task-manager

For this repository, `contribution.json` must contain the contributor's ID, **73195**:

```json
{
  "contributorStudentId": "73195"
}
```

For the outgoing contribution to student **73195**'s repository, the corresponding JSON must instead contain **72564**. Both contributions must be created through genuine Pull Requests from the respective students' accounts, reviewed, and merged by the receiving repository owners.

**Important:** The contributor files are already present in this repository, but their presence alone does not establish the required merged Pull Request history. Coordinate with your partner before replacing files, and do not record a Pull Request as complete without a real merged PR link.

### Merged Pull Request links

- **Incoming PR (73195 → 72564):** https://github.com/vistula-team-project-73195/vistula-task-manager/pull/2)
- **Outgoing PR (72564 → 73195):** _ — add merged PR URL_



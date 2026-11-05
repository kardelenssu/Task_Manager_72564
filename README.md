# Task Manager — Team Project (IT)

**Student:** Kardelen Su Kurt  
**Student ID:** 72564  
**Course:** Team Project – IT

## Project overview

A simple Task Manager built using HTML and JavaScript. The application connects to a Supabase PostgreSQL database through its automatically generated REST API and is intended to be hosted on GitHub Pages.

## Project links

- **Current GitHub repository:** https://github.com/kardelenssu/vistula-task-manager
- **Application:** Add the verified GitHub Pages URL after deployment.
- **Team contribution page:** Add the verified public URL to `contribution.html` after deployment.
- **Contributor JSON:** Add the verified public URL to `contribution.json` after deployment.

> **Repository naming requirement:** The assignment requires a repository named exactly `vistula-task-manager`, under a dedicated GitHub username following the format `vistula-team-project-STUDENT_ID`. The repository name is now `vistula-task-manager`, but the account username `kardelenssu` differs from the dedicated course username format. Confirm with your instructor or move the project to the dedicated course account before submitting.

## Technologies

- HTML, CSS, JavaScript
- Git and GitHub
- GitHub Pages
- Supabase PostgreSQL
- Supabase REST API

## Features

- Display tasks from the database
- Add a new task with a required title and optional description
- Edit an existing task
- Mark a task as completed or incomplete
- Delete a task
- Keep changes saved after refreshing the page
- View a team contributor's student ID from `contribution.json`

## Project files

| File | Description |
| --- | --- |
| `index.html` | Main Task Manager interface |
| `app.js` | REST API requests and task-management functionality |
| `config.json` | Public Supabase URL, publishable API key, and table name |
| `contribution.html` | Team contribution page |
| `contribution.json` | Student ID of the student who contributed the page |
| `README.md` | Project documentation and collaboration links |

## Supabase database setup

The dedicated demonstration project **Vistula Task Manager 72564** is already created in student 73195’s Supabase organization at https://supabase.com/dashboard/project/srztimmmafjkxfxiizlv. Its `tasks` table and public demo policies are already installed:

| Column | Type | Requirements |
| --- | --- | --- |
| `id` | BIGINT | Auto-generated primary key |
| `title` | TEXT | Required |
| `description` | TEXT | Optional |
| `completed` | BOOLEAN | Default `false` |

Enable Row Level Security (RLS) and configure the demonstration table's public `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies, as required by the assignment. **This is a public demo database: do not store sensitive data.**

The root `config.json` already contains the verified project URL and a public, non-secret publishable key. You do not need to make a second database project. The database was tested through SQL; GitHub Pages and browser REST operations must still be checked after publishing.

Do not commit database passwords, service-role keys, or other secret credentials. Only the public Supabase publishable key belongs in browser-side code.

## Run locally

From the project directory, start a local web server:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000/ in a browser. Database operations require a working Supabase configuration.

## Deploy to GitHub Pages

1. Upload the application root files to the public GitHub repository under the partner’s own account. The connected account does not have permission to commit to her repository.
2. Go to **Settings → Pages**.
3. Select **Deploy from a branch**, branch **main**, folder **/(root)**, then save.
4. Open the published page and test all task operations.

For the required repository naming scheme, the expected application URL would be:

`https://vistula-team-project-72564.github.io/vistula-task-manager/`

**This is an expected URL format, not a verified deployment link.**

## Team collaboration

**Repository owner:** Kardelen Su Kurt — **72564**  
**Partner contributor:** Student ID **73195**

The required `contribution.json` in this repository should contain:

```json
{
  "contributorStudentId": "73195"
}
```

The `contribution.html` page must fetch this JSON file when the **Show Contributor** button is clicked and display the ID. The files must be introduced by the partner through a GitHub Pull Request and merged by the repository owner.

The repository owner must also create a Pull Request to the partner's repository, containing the contributor page and a `contribution.json` identifying **72564**. Both PRs must be genuinely opened and merged to satisfy the assignment.

### Pull Request links

- **Incoming PR (73195 → this repository):** _Pending — replace with actual merged PR URL_
- **Outgoing PR (72564 → partner repository):** _Pending — replace with actual merged PR URL_

Partner repository: https://github.com/vistula-team-project-73195/vistula-task-manager

> The contribution files currently exist in the repository, but their presence alone does not demonstrate the required Pull Request history. Coordinate the Git workflow with your partner; do not claim these PRs are completed until both are merged.

## Submission checklist

- [ ] Repository name and account format match the assignment
- [ ] GitHub Pages deployment is publicly accessible
- [x] `config.json` points to the separate demonstration Supabase project
- [ ] All tasks can be created, read, updated, completed, and deleted
- [ ] Database data persists after refreshing
- [ ] Contributor page displays the partner's ID from the JSON file
- [ ] Partner's incoming PR is merged
- [ ] Owner's outgoing PR is merged
- [ ] Both merged PR links are included above

**Final Platon submission:** Submit only the public GitHub Pages application URL after all requirements are met.

## Contents of this ZIP package

The project root contains a complete frontend with Supabase configuration already filled in. Database SQL operations have been checked; deployed browser CRUD operations have not been verified.
The root contribution page and JSON reproduce the *existing* contributor page using ID 73195.
The `outgoing-pr-to-73195/` folder contains the two files student 72564 should propose through a Pull Request to student 73195's GitHub repository. These files are not to be uploaded to the root of student 72564's own repository.

**Caution:** This ZIP is not proof of the required collaboration. Both partners must submit and merge their respective Pull Requests, and neither student should claim that existing directly committed files were added via a PR.

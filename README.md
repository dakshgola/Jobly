# Jobly — Job Portal with AI Features

## Overview
A job portal web application that allows candidates to find jobs and recruiters to post and manage listings.
Includes AI-based features like job matching and resume feedback.

---

## Features

### Candidate
* Browse jobs
* Search and filter jobs
* View job details
* Apply to jobs
* Save jobs
* AI match score (job vs profile)
* AI resume feedback

### Recruiter
* Post jobs
* Manage job listings
* View applicants
* Improve job descriptions using AI

---

## AI Features
* Job match score based on skills and experience
* Skill gap suggestions
* Resume feedback
* Job description improvement

---

## Tech Stack

**Frontend:**
* React (Vite)
* Tailwind CSS

**Backend / Services:**
* Supabase
* Clerk Authentication

**AI:**
* Gemini API

---

## Setup

\`\`\`bash
git clone <repo-url>
npm install
npm run dev
\`\`\`

---

## Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_JSEARCH_API_KEY=your_rapidapi_jsearch_key
```

---

## Architectural Pivot (JSearch Live Integration)
Jobly has transitioned from a recruiter-posted platform to a single-role live job board driving on-demand API syncing.
* Listings query the `external_jobs` Supabase cache.
* If a search yields empty cache results, it automatically syncs fresh postings from JSearch.
* External apply URLs redirect applicants directly to target job hostings.

---

## Deployment
Deployed on Vercel.


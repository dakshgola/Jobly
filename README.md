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

Create a \`.env\` file in the root directory:

\`\`\`bash
VITE_GEMINI_API_KEY=your_key
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_KEY=your_key
\`\`\`

---

## Deployment
Deployed on Vercel.

---

## Notes
This project is built as a practical implementation of a job portal with added AI features.

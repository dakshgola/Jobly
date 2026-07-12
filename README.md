# Jobly — AI-Powered Job Search Assistant

> An AI-powered job search assistant that parses resumes, matches candidates to live job listings, and tracks applications end-to-end.

---

## Overview

Jobly is a single-role job search assistant designed strictly for job seekers looking to streamline their application workflows. Instead of relying on static recruiter job postings, Jobly leverages the live external JSearch API to fetch real-time listings on-demand. Through Google Gemini integrations, candidates can extract profile data from resumes, verify completeness, score matches against live listings, and track application states directly from a single portal.

---

## Features

* **Resume Parsing & Profile Extraction**: Upload resume files (PDF and DOCX formats) to automatically parse raw text using `pdfjs-dist` and `mammoth`, sending extracted blocks to Google Gemini to populate candidate profile tables in Supabase.
* **Completeness Scoring**: Calculates profile completeness using a custom weighted metric, guiding candidates with inline forms to fill missing skills, summaries, experiences, or education.
* **Live Job Cache-Sync Pipeline**: Performs search queries against cached jobs. If the local database returns zero entries for active keywords, Jobly falls back to JSearch APIs to retrieve and cache live postings dynamically.
* **Explainable AI Match Rankings**: Evaluates cached listings against the candidate's profile, providing a percentage match score alongside descriptive bullet points explaining *why* a candidate fits the position.
* **Application Status Tracking**: Log applications under status categories (Applied, Interviewing, Selected, Rejected). When applying for external listings, candidates are redirected to original application URLs and prompted to record their status in Jobly.
* **Clerk Auth & Supabase Backend**: Secured with Clerk user registration and authenticated database transactions utilizing Supabase Row Level Security (RLS).

---

## Tech Stack

* **Frontend**: React (Vite), Tailwind CSS, shadcn-ui, Framer Motion
* **Database & Storage**: Supabase (Postgres & Storage buckets)
* **Authentication**: Clerk React SDK
* **Artificial Intelligence**: Google Gemini API
* **External Job Data**: RapidAPI JSearch API
* **Document Parsing**: `pdfjs-dist` (for PDF text extractors), `mammoth` (for DOCX XML parsing)

---

## Architecture: Clerk-Supabase JWT Bridge

Jobly integrates a secure JWT bridge linking Clerk authentication directly with Supabase Row Level Security:
1. When a user authenticates via Clerk, a Supabase-compatible JWT is generated via a custom integration template.
2. The client passes this token in the header of Supabase client queries.
3. Supabase validates the token signature directly against Clerk's third-party issuer configuration.
4. RLS policies inspect the validated `auth.uid()` attribute, ensuring candidates can access only their respective application rows and profile entries.

---

## Setup Instructions

### Prerequisites
Ensure you have Node.js installed locally.

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd JOBLY
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   VITE_CLERK_PUBLISHABLE_KEY=
   VITE_GEMINI_API_KEY=
   VITE_JSEARCH_API_KEY=
   ```

4. **Run Locally**:
   ```bash
   npm run dev
   ```

---

## Known Limitations

* **API Free-Tier Rate Limits**: The JSearch API is subject to monthly search volume limits under the free tier. Frequent query refreshes might trigger rate warnings.
* **Gemini Resource Quotas**: Google Gemini matching scores rely on API credits; usage volume limits may prevent profile scoring if key quotas are exceeded.
* **Portfolio Scope**: Jobly is built as an engineering portfolio project. It does not support recruiter job creation or employer dashboard portals.

# Jobly — Job Portal Web Application

Jobly is a modern job portal web application built to support job discovery for candidates and hiring workflows for recruiters.  
The project focuses on clean UI, role-based access, and real-world job portal functionality using a SaaS-style frontend.

---

## Features

### Candidate
- Browse available job listings
- Search jobs by title
- Filter jobs by location and company
- View detailed job descriptions
- Apply to jobs
- Save jobs for later

### Recruiter
- Post new job openings
- Manage posted jobs
- Control job hiring status (Open / Closed)
- View applications for each job
- Add and manage companies

### Authentication & Access Control
- User authentication using Clerk
- Google OAuth support
- Role-based routing (Candidate / Recruiter)
- Protected routes for authenticated users

---

## UI / UX
- Dark SaaS-style interface
- Gradient-based layout
- Responsive design (mobile-first)
- Reusable component system
- Clean typography and spacing
- Smooth hover and transition effects

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Shadcn UI
- React Router
- Lucide Icons

### Backend / Services
- Supabase (Database & APIs)
- Clerk (Authentication)

---

## Project Architecture
- Component-based UI structure
- Centralized Supabase client
- Custom hooks for data fetching
- Separation of pages, components, and services
- Role-based application flow

---

## Scalable Features (Can Be Added)

- Advanced job recommendation system
- Recruiter analytics dashboard
- Email notifications for applications
- Job application status tracking
- Admin panel for platform moderation
- Pagination & infinite scrolling
- Saved searches & alerts
- Multi-role permissions
- Company profile pages

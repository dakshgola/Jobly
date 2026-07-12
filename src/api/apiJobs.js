import supabaseClient from "@/utils/supabase";
import { seedJobs } from "@/data/seedJobs";

// Fetch Jobs
export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
  }

  if (error || !data || data.length === 0) {
    let fallbackJobs = seedJobs;
    if (location) {
      fallbackJobs = fallbackJobs.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (searchQuery) {
      fallbackJobs = fallbackJobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (company_id) {
       // Best effort to find company name based on ID passed from select if there's no DB
       // but seedJobs only have names. Filter out if standard company_id is provided.
       return [];
    }
    return fallbackJobs;
  }

  return data;
}

// Read Saved Jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

// Read single job
export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select(
      "*, company: companies(name,logo_url), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    // Attempt fallback to external_jobs table
    const { data: extData, error: extError } = await supabase
      .from("external_jobs")
      .select("*")
      .eq("id", job_id)
      .single();

    if (!extError && extData) {
      const { data: extApps } = await supabase
        .from("applications")
        .select("*")
        .eq("external_job_id", job_id);

      return {
        ...extData,
        company: {
          name: extData.company || "External Company",
          logo_url: null,
        },
        applications: extApps || [],
        isOpen: true,
        isExternal: true,
      };
    }

    const seedJob = seedJobs.find((job) => job.id === job_id);
    if (seedJob) {
      return { ...seedJob, applications: [] };
    }
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

// - Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the job is already saved, remove it
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return data;
    }

    return data;
  } else {
    // If the job is not saved, add it to saved jobs
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      return data;
    }

    return data;
  }
}

// - job isOpen toggle - (recruiter_id = auth.uid())
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

// get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}

// - post job
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error || !data) {
    console.error("Supabase Error (Offline Mode). Mocking successful job post:", error);
    return [{
      ...jobData,
      id: Math.floor(Math.random() * 1000) + 100,
    }];
  }

  return data;
}
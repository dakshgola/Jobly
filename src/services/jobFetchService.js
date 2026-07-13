/**
 * Calls JSearch API to fetch live external job postings matching keywords and locations.
 * Normalizes results into external_jobs schema format.
 * 
 * @param {string} query - Job title / role search keyword (e.g. "React Developer")
 * @param {string} location - City / state / region keyword (e.g. "Delhi")
 * @returns {Promise<Array>} Normalized external jobs list
 */
export async function fetchJSearchJobs(query, location) {
  const apiKey = import.meta.env.VITE_JSEARCH_API_KEY;
  if (!apiKey) {
    console.error("VITE_JSEARCH_API_KEY is not defined in env. Please define VITE_JSEARCH_API_KEY.");
    return [];
  }

  // Combine query and location for Google-for-jobs style search query
  const searchTerms = location ? `${query} in ${location}` : query;
  const url = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(searchTerms)}&page=1&num_pages=1`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`JSearch API failed: ${response.status} - ${errText}`);
  }

  const result = await response.json();
  const rawJobs = result.data?.jobs || [];

  return rawJobs.map((job) => {
    // Normalizing location
    const locationParts = [job.job_city, job.job_state, job.job_country]
      .filter(Boolean)
      .join(", ");

    // Parse date timestamp
    let posted_at = null;
    if (job.job_posted_at_timestamp) {
      posted_at = new Date(job.job_posted_at_timestamp * 1000).toISOString();
    }

    return {
      source: "jsearch",
      external_id: job.job_id,
      title: job.job_title,
      company: job.employer_name || null,
      location: locationParts || null,
      description: job.job_description || null,
      apply_url: job.job_apply_link,
      salary_min: job.job_min_salary || null,
      salary_max: job.job_max_salary || null,
      posted_at,
    };
  });
}

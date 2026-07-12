import supabaseClient from "@/utils/supabase";

/**
 * Fetches cached external jobs from the Supabase database.
 * 
 * @param {string} token - Clerk authorization token
 * @param {Object} queryParams - Search and location filters
 * @returns {Promise<Array>} Cached jobs array
 */
export async function getExternalJobs(token, { searchQuery, location }) {
  const supabase = await supabaseClient(token);
  let query = supabase.from("external_jobs").select("*");

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }
  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching external jobs:", error);
    return [];
  }
  return data;
}

/**
 * Upserts freshly fetched external jobs into the database.
 * De-duplicates matching rows based on the unique key constraint (source, external_id).
 * 
 * @param {string} token - Clerk authorization token
 * @param {null} _ - Unused query details parameter
 * @param {Array} jobsList - List of normalized jobs to upsert
 * @returns {Promise<Array>} Synced row results
 */
export async function upsertExternalJobs(token, _, jobsList) {
  const supabase = await supabaseClient(token);
  if (!jobsList || jobsList.length === 0) return [];

  const { data, error } = await supabase
    .from("external_jobs")
    .upsert(jobsList, { onConflict: "source,external_id" })
    .select();

  if (error) {
    console.error("Error upserting external jobs:", error);
    throw new Error(error.message || "Failed to upsert external jobs");
  }

  return data;
}

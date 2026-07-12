import supabaseClient, { supabaseUrl } from "@/utils/supabase";
import { seedJobs } from "@/data/seedJobs";

// Fetch Companies
export async function getCompanies(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("companies").select("*");

  if (error || !data || data.length === 0) {
    console.error("Error fetching Companies (using mock data):", error);
    
    // Extract unique companies from seed jobs for fallback
    const mockCompanies = [];
    const seenNames = new Set();
    
    seedJobs.forEach((job, index) => {
      if (!seenNames.has(job.company.name)) {
        seenNames.add(job.company.name);
        mockCompanies.push({
          id: index + 100, // Safe mock integer ID
          name: job.company.name,
          logo_url: job.company.logo_url
        });
      }
    });

    return mockCompanies;
  }

  return data;
}

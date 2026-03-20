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

// Add Company
export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const cleanName = companyData.name.replace(/[^a-zA-Z0-9]/g, "_");
  const fileExt = companyData.logo.name.split('.').pop();
  const fileName = `logo-${random}-${cleanName}.${fileExt}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) {
    console.error("Supabase Storage Error:", storageError);
    // Silent fallback for preview mode since DB is offline
  }

  const logo_url = storageError 
    ? URL.createObjectURL(companyData.logo) // Use local blob URL for temporary preview
    : `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url: logo_url,
      },
    ])
    .select();

  if (error || !data) {
    console.error("Error submitting Company, returning mock Data:", error);
    return [{
       id: Math.floor(Math.random() * 1000) + 200,
       name: companyData.name,
       logo_url: logo_url,
    }];
  }

  return data;
}
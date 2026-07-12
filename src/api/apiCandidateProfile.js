import supabaseClient, { supabaseUrl } from "@/utils/supabase";
import { calculateCompleteness } from "@/utils/completeness";

// Fetch Candidate Profile
export async function getCandidateProfile(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching Candidate Profile:", error);
    return null;
  }
  return data;
}

// Upsert Candidate Profile (including uploading resume to resumes storage bucket)
export async function upsertCandidateProfile(token, _, { profileData, resumeFile }) {
  const supabase = await supabaseClient(token);
  let resume_url = profileData.resume_url;

  if (resumeFile) {
    const random = Math.floor(Math.random() * 90000);
    const fileExt = resumeFile.name.split(".").pop();
    const fileName = `profile-resume-${random}-${profileData.user_id}.${fileExt}`;

    const { error: storageError } = await supabase.storage
      .from("resumes")
      .upload(fileName, resumeFile, {
        upsert: true,
      });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      throw new Error("Error uploading Resume to Storage");
    }

    resume_url = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;
  }

  // Calculate completeness score dynamically
  const completeness = calculateCompleteness({
    ...profileData,
    resume_url,
  });

  const { data, error } = await supabase
    .from("candidate_profiles")
    .upsert(
      {
        ...profileData,
        resume_url,
        profile_completeness: completeness,
      },
      { onConflict: "user_id" }
    )
    .select();

  if (error) {
    console.error("Error upserting Candidate Profile:", error);
    throw new Error("Error saving candidate profile details");
  }

  return data;
}

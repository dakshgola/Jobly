/**
 * Scores candidate profile completeness out of 100 based on:
 * - name, headline, location, summary present (20% total - 5% each)
 * - at least 1 education entry (20%)
 * - at least 1 experience entry (30%)
 * - at least 3 skills (20%)
 * - resume_url present (10%)
 * 
 * @param {Object} profile - The candidate profile object
 * @returns {number} The completeness score out of 100
 */
export const calculateCompleteness = (profile) => {
  if (!profile) return 0;

  let score = 0;

  // 1. Basic Info Fields (20% total, 5% each)
  if (profile.full_name) score += 5;
  if (profile.headline) score += 5;
  if (profile.location) score += 5;
  if (profile.summary) score += 5;

  // 2. Education (20% for at least 1 entry)
  if (Array.isArray(profile.education) && profile.education.length >= 1) {
    score += 20;
  }

  // 3. Experience (30% for at least 1 entry)
  if (Array.isArray(profile.experience) && profile.experience.length >= 1) {
    score += 30;
  }

  // 4. Skills (20% for at least 3 elements)
  if (Array.isArray(profile.skills) && profile.skills.length >= 3) {
    score += 20;
  }

  // 5. Resume (10% for uploaded resume URL)
  if (profile.resume_url) {
    score += 10;
  }

  return score;
};

/**
 * Returns a list of specific missing items and their editing keys.
 * 
 * @param {Object} profile - The candidate profile object
 * @returns {Array<{key: string, label: string}>} Array of missing items
 */
export const getMissingItems = (profile) => {
  const missing = [];

  if (!profile) {
    return [
      { key: "info", label: "Profile Info (Name, Headline, Location)" },
      { key: "summary", label: "Missing Summary" },
      { key: "education", label: "Missing Education (Add at least 1 entry)" },
      { key: "experience", label: "Incomplete Experience (Add at least 1 entry)" },
      { key: "skills", label: "Missing Skills (Need at least 3 skills)" },
      { key: "resume", label: "Missing Resume Upload" },
    ];
  }

  const missingInfo = [];
  if (!profile.full_name) missingInfo.push("Name");
  if (!profile.headline) missingInfo.push("Headline");
  if (!profile.location) missingInfo.push("Location");
  if (missingInfo.length > 0) {
    missing.push({ key: "info", label: `Missing Info (${missingInfo.join(", ")})` });
  }

  if (!profile.summary) {
    missing.push({ key: "summary", label: "Missing Summary" });
  }

  if (!Array.isArray(profile.education) || profile.education.length < 1) {
    missing.push({ key: "education", label: "Missing Education (Add at least 1 entry)" });
  }

  if (!Array.isArray(profile.experience) || profile.experience.length < 1) {
    missing.push({ key: "experience", label: "Incomplete Experience (Add at least 1 entry)" });
  }

  if (!Array.isArray(profile.skills) || profile.skills.length < 3) {
    const current = Array.isArray(profile.skills) ? profile.skills.length : 0;
    missing.push({ key: "skills", label: `Missing Skills (Need ${3 - current} more)` });
  }

  if (!profile.resume_url) {
    missing.push({ key: "resume", label: "Missing Resume Upload" });
  }

  return missing;
};

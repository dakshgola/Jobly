import genAI from "./aiConfig";

export const getRecommendedJobs = async (jobs, profile) => {
  if (!jobs || jobs.length === 0) return [];
  
  if (!genAI) {
    // Mock response: Just return first 2 jobs
    return new Promise((resolve) => setTimeout(() => resolve(jobs.slice(0, 2).map(j => j.id)), 1200));
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const profileContext = profile && Object.keys(profile).length > 0
      ? JSON.stringify(profile)
      : "Generic profile (focus on remote or entry-level roles)";

    const jobsContext = jobs.map(j => `ID: ${j.id} | Title: ${j.title} | Requirements: ${j.requirements.substring(0, 100)}...`).join("\n");

    const prompt = `
You are a career matchmaking AI.
Given a list of available jobs and a candidate's profile, pick the top 3 best matching job IDs.

CANDIDATE PROFILE:
${profileContext}

AVAILABLE JOBS:
${jobsContext}

Analyze the match and return STRICTLY a JSON array of the recommended Job IDs as strings.
Example: ["id-1", "id-2"]
Do not wrap in markdown \`\`\`json blocks.
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith("\`\`\`json")) text = text.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    else if (text.startsWith("\`\`\`")) text = text.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.warn("AI Recommendations API Error (Falling back to mock mode):", error.message);
    const validJobs = Array.isArray(jobs) ? jobs : [];
    return validJobs.slice(0, 3).map(j => j?.id).filter(Boolean);
  }
};

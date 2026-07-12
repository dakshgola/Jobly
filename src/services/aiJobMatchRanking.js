import genAI from "./aiConfig";

export const getJobMatchRankings = async (jobs, profile) => {
  if (!jobs || jobs.length === 0) return [];

  // Generate a mock response for seed jobs as fallback
  const mockRankings = jobs.map((job) => ({
    id: job.id,
    score: Math.floor(Math.random() * 30) + 60, // 60-90
    why_matches: [
      `Your background aligns with the responsibilities in ${job.title}.`,
      "Your core technical skill sets are relevant to the job requirements.",
      "Good alignment with the location and role type specified."
    ]
  })).sort((a, b) => b.score - a.score);

  if (!genAI || !profile) {
    // Mock response if API key or profile missing
    return new Promise((resolve) => setTimeout(() => resolve(mockRankings), 1500));
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const profileContext = JSON.stringify({
      full_name: profile.full_name,
      headline: profile.headline,
      location: profile.location,
      summary: profile.summary,
      skills: profile.skills,
      experience: profile.experience,
      education: profile.education
    });

    const jobsContext = jobs.map(j => 
      `ID: ${j.id} | Title: ${j.title} | Location: ${j.location} | Description: ${j.description} | Requirements: ${j.requirements}`
    ).join("\n---\n");

    const prompt = `
You are an expert AI talent acquisition specialist and career matchmaker.
Analyze the candidate's profile against the list of available jobs.
For each job in the list, compute a suitability match score between 0 and 100, and provide exactly 2 to 3 bullet points explaining why the candidate matches (written directly to the candidate).

CANDIDATE PROFILE:
${profileContext}

AVAILABLE JOBS:
${jobsContext}

Compare the candidate's skills, experience, and education to each job. Return the results STRICTLY as a raw JSON array of objects. Do not wrap in markdown \`\`\`json blocks.
Return EXACTLY this format and nothing else:

[
  {
    "id": "<job ID string>",
    "score": <number between 0 and 100>,
    "why_matches": [
      "point 1 detailing match reasons",
      "point 2 detailing match reasons",
      "point 3 detailing match reasons"
    ]
  }
]
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    if (text.startsWith("```json")) {
      text = text.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (text.startsWith("```")) {
      text = text.replace(/^```/, "").replace(/```$/, "").trim();
    }

    return JSON.parse(text);
  } catch (error) {
    console.warn("AI Job Rankings API Error (Falling back to mock mode):", error.message);
    return mockRankings;
  }
};

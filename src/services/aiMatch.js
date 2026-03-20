import genAI from "./aiConfig";

export const getMatchScore = async (job, profile) => {
  const mockMatchScore = {
    score: Math.floor(Math.random() * 30) + 60, // 60-90
    matched_skills: ["React", "JavaScript", "Problem Solving", "UI Design"],
    missing_skills: ["Docker", "Advanced GraphQL"],
    summary: "This is a statistically strong match. Your foundational frontend skills align perfectly with the role requirements, though some specific devops tooling is missing from your profile."
  };

  // If no Gemini client is initialized, return a compelling randomized mock payload for UI testing
  if (!genAI) {
    return new Promise((resolve) => setTimeout(() => resolve(mockMatchScore), 1200));
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // We stringify the job requirements safely so the prompt doesn't break
    const jobContext = `Title: ${job.title}\nDescription: ${job.description}\nRequirements: ${job.requirements}`;
    
    // Fallback profile context if user profile isn't fully filled out in Clerk yet
    const profileContext = profile && Object.keys(profile).length > 0 
      ? JSON.stringify(profile) 
      : "Candidate has an active profile but specific technical skills metadata were not provided yet. Assess based on foundational general suitability.";

    const prompt = `
You are an expert AI technical recruiter assistant.
Carefully compare the following job description to the candidate profile elements.

JOB DESCRIPTION:
${jobContext}

CANDIDATE PROFILE DATA:
${profileContext}

Analyze the candidate's fit for the job and return the result STRICTLY as a raw JSON payload. Do not wrap it in markdown blockquotes like \`\`\`json. Return EXACTLY this structure and nothing else:

{
  "score": <number between 0 and 100 representing the match percentage>,
  "matched_skills": ["list", "of", "skills", "they", "have"],
  "missing_skills": ["list", "of", "skills", "they", "need"],
  "summary": "<A short 2-3 sentence explanation directly to the candidate about why they got this score>"
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Safety sanitization just in case Gemini occasionally wraps in markdown JSON block
    if (text.startsWith("\`\`\`json")) {
       text = text.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    } else if (text.startsWith("\`\`\`")) {
       text = text.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.warn("AI Match API Error (Falling back to mock mode):", error.message);
    return mockMatchScore;
  }
};

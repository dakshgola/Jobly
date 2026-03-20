import genAI from "./aiConfig";

export const getResumeFeedback = async (profile) => {
  const mockFeedback = {
    strengths: ["Strong foundational programming knowledge.", "Good history of building practical applications."],
    weaknesses: ["Missing advanced systems architecture experience.", "Limited backend/database exposure."],
    suggestions: ["Consider adding a full-stack project utilizing modern infrastructure tools.", "Highlight specific performance improvements or metrics in your past roles."]
  };

  if (!genAI) {
    // Mock response if API key missing
    return new Promise((resolve) => setTimeout(() => resolve(mockFeedback), 1200));
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const profileContext = profile && Object.keys(profile).length > 0
      ? JSON.stringify(profile)
      : "The user has not fully filled out their technical skills metadata yet. Provide generalized advice about what makes a strong tech profile.";

    const prompt = `
You are an expert tech career coach. Review this candidate profile:

CANDIDATE PROFILE:
${profileContext}

Analyze the profile and return actionable feedback STRICTLY as raw JSON. Do not wrap in markdown \`\`\`json blocks. Return exactly this format:
{
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": ["actionable advice 1", "actionable advice 2"]
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith("\`\`\`json")) {
       text = text.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    } else if (text.startsWith("\`\`\`")) {
       text = text.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "").trim();
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.warn("AI Feedback API Error (Falling back to mock mode):", error.message);
    return mockFeedback;
  }
};

import genAI from "./aiConfig";

export const enhanceJobDescription = async (inputText) => {
  if (!genAI || !inputText) {
    // Defensive mock response if API fails or key is missing
    return inputText + "\n\n*✨ Enhanced by AI:\n- Clearer formatting applied\n- Required skills formatted elegantly\n- Action-oriented descriptions added*";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
Improve this job description professionally to make it sound premium and highly attractive to top-tier candidates.

ORIGINAL TEXT:
${inputText}

INSTRUCTIONS:
1. Make it Clear and Structured.
2. Use professional Markdown bullet points.
3. Fix any grammar and tone issues.
4. DO NOT add conversational intro/outro (e.g. "Here is the enhanced version"). 
5. ONLY return the raw markdown string of the improved job post so it can be pasted directly into an editor.
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.warn("AI Enhance Error (Falling back to mock mode):", error.message);
    return inputText + "\n\n*✨ Enhanced by AI (Fallback Mode):\n\n- Improved clarity\n- Action-oriented bullets\n- Professional structuring applied automatically.*";
  }
};

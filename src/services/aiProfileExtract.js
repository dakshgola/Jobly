import genAI from "./aiConfig";

export const extractProfileFromResume = async (resumeText) => {
  const mockExtractedProfile = {
    full_name: "Daksh Gola",
    headline: "Frontend Engineer & React Developer",
    location: "Delhi, India",
    summary: "Passionate Frontend Engineer with experience building high-performance web applications using React, Tailwind, and Node.js. Focused on clean code and user experience.",
    education: [
      {
        institution: "Delhi Technological University",
        degree: "Bachelor of Technology in Computer Science",
        start_year: "2020",
        end_year: "2024"
      }
    ],
    experience: [
      {
        company: "TechCorp Solutions",
        role: "Software Engineer Intern",
        start_date: "June 2023",
        end_date: "Dec 2023",
        description: "Developed responsive React pages, integrated REST APIs, and improved page load speed by 25%."
      }
    ],
    skills: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Git", "REST APIs"],
    certifications: ["Meta Front-End Developer Professional Certificate"]
  };

  if (!genAI || !resumeText) {
    return new Promise((resolve) => setTimeout(() => resolve(mockExtractedProfile), 1500));
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are an expert ATS (Applicant Tracking System) parser.
Your task is to parse the following raw text extracted from a candidate's resume/CV and return the structured profile data.

RAW RESUME TEXT:
${resumeText}

Analyze the text and return the parsed candidate profile STRICTLY as a raw JSON payload. Do not wrap it in markdown blockquotes like \`\`\`json. Return EXACTLY this structure and nothing else:

{
  "full_name": "<Candidate's full name, or empty string if not found>",
  "headline": "<A professional headline like 'Senior Backend Developer' or empty string>",
  "location": "<City, Country or Remote, or empty string>",
  "summary": "<A 2-3 sentence professional summary based on their background, or empty string>",
  "education": [
    {
      "institution": "<Name of university/school>",
      "degree": "<Degree name like B.S. in CS>",
      "start_year": "<Start year, or empty string>",
      "end_year": "<End year, graduation year, or 'Present'>"
    }
  ],
  "experience": [
    {
      "company": "<Company name>",
      "role": "<Job title>",
      "start_date": "<Start date e.g. June 2022>",
      "end_date": "<End date e.g. Present or Dec 2023>",
      "description": "<Brief bulleted or paragraph summary of achievements and duties>"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "certifications": ["Certification 1", "Certification 2"]
}
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
    console.warn("AI Profile Extraction API Error (Falling back to mock mode):", error.message);
    return mockExtractedProfile;
  }
};

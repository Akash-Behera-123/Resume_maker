import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";


// --------------------
// Enhance Summary
// --------------------
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Enhance the professional summary in 1-2 sentences, ATS-friendly. Return only text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent =
      response?.choices?.[0]?.message?.content || "No response generated";

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// --------------------
// Enhance Job Description
// --------------------
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Enhance job description in 1-2 sentences with action verbs and measurable results. Return only text.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent =
      response?.choices?.[0]?.message?.content || "No response generated";

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// --------------------
// Upload Resume (FINAL WORKING VERSION)
// --------------------
export const uploadResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ Use stable Node-compatible parser
    const pdfParse = (await import("pdf-parse-fixed")).default;

    const pdfData = await pdfParse(file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText) {
      return res.status(400).json({ message: "Could not extract text" });
    }

    const systemPrompt =
      "You are an expert AI Agent to extract structured data from resumes.";

    const userPrompt = `extract data from this resume: ${resumeText}

Return ONLY JSON in this format:

{
  "professionalSummary": "",
  "skills": [],
  "personalInfo": {
    "image": "",
    "fullName": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "description": "",
      "isCurrent": false
    }
  ],
  "projects": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduationDate": "",
      "gpa": ""
    }
  ]
}`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData =
      response?.choices?.[0]?.message?.content?.trim() || "{}";

    let parseData = {};

    try {
      parseData = JSON.parse(extractedData);
    } catch (err) {
      return res.status(500).json({ message: "Invalid JSON from AI" });
    }

    const newResume = await Resume.create({
      userId,
      title,
      ...parseData,
    });

    return res.json({ resumeId: newResume._id });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
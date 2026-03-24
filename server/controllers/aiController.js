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
      const {resumeText,title} = req.body;
      const userId = req.userId;

      if(!resumeText || typeof resumeText !== "string" || !resumeText.trim()){
         return res.status(400).json({ message: "Missing required fields" });
      }
      const systemPrompt ="You are an expert AI Agent to extract data from resume."
      const userPrompt= `extract data from this resume : ${resumeText}
      Provide data in the following JSON format with no additional text before or after:
      {
      
    professionalSummary: { type: String, default: '' },

    skills: [{ type: String, default: '' }],

    personalInfo: {
        image: { type: String, default: '' },
        fullName: { type: String, default: '' },
        profession: { type: String, default: '' },
        email: { 
            type: String, 
            default: '',
            match: [/^\S+@\S+\.\S+$/, 'Invalid email']
        },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' },
    },

    experience: [
        {
            company: { type: String, default: '' },
            position: { type: String, default: '' },
            startDate: { type: String, default: '' },
            endDate: { type: String, default: '' },
            description: { type: String, default: '' },
            isCurrent: { type: Boolean, default: false },
        }
    ],

    projects: [
        {
            name: { type: String, default: '' },
            type: { type: String, default: '' },
            description: { type: String, default: '' },
        }
    ],

    education: [
        {
            institution: { type: String, default: '' },
            degree: { type: String, default: '' },
            field: { type: String, default: '' },
            graduationDate: { type: String, default: '' },
            gpa: { type: String, default: '' },
        }
    ],

      }

      `

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        },
      ],
      response_format:  {type:'json_object'}
    });

    const extractedData =
      response?.choices?.[0]?.message?.content ;
      const  parseData =JSON.parse(extractedData)
      const newResume = await Resume.create({userId,title,...parseData})


     res.json({ resumeId: newResume._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

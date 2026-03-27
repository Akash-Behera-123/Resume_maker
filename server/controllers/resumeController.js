import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from 'fs';

// --------------------
// CREATE RESUME
// --------------------
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const newResume = await Resume.create({ userId, title });

    return res.status(201).json({
      message: 'Resume created successfully',
      resume: newResume
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------
// DELETE RESUME
// --------------------
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const deleted = await Resume.findOneAndDelete({ userId, _id: resumeId });

    if (!deleted) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ message: 'Resume deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------
// GET RESUME (PRIVATE)
// --------------------
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------
// GET PUBLIC RESUME
// --------------------
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ public: true, _id: resumeId });

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    return res.status(200).json({ resume });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------
// UPDATE RESUME
// --------------------
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    // Parse resumeData
    let resumeDataCopy = typeof resumeData === 'string'
      ? JSON.parse(resumeData)
      : structuredClone(resumeData);

    // Convert backend camelCase fields
    if (resumeDataCopy.professional_summary) {
      resumeDataCopy.professionalSummary = resumeDataCopy.professional_summary;
      delete resumeDataCopy.professional_summary;
    }
    if (resumeDataCopy.accent_color) {
      resumeDataCopy.accentColor = resumeDataCopy.accent_color;
      delete resumeDataCopy.accent_color;
    }

    // Merge personalInfo
    let personalInfoUpdate = resumeDataCopy.personalInfo || {};
    if (resumeDataCopy.personal_info) {
      personalInfoUpdate = { ...resumeDataCopy.personal_info, ...personalInfoUpdate };
      delete resumeDataCopy.personal_info;
    }

    // Handle uploaded image
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);
      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: 'resume.png',
        folder: 'user-resumes',
        transformation: {
          pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')
        }
      });
      personalInfoUpdate.image = response.url;
    }

    // Attach updated personalInfo
    resumeDataCopy.personalInfo = personalInfoUpdate;

    // Update DB
    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      { $set: resumeDataCopy },
      { returnDocument: 'after' }
    );

    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    return res.status(200).json({ message: 'Saved successfully', resume });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
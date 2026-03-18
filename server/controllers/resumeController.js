import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from 'fs';

// controller for creating a new resume
// POST: /api/resumes/create
export const createResume = async (req,res) => {
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
}


// controller for deleting a resume
// DELETE: /api/resumes/delete/:resumeId
export const deleteResume = async (req,res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const deleted = await Resume.findOneAndDelete({ userId, _id: resumeId });

        if (!deleted) {
            return res.status(404).json({ message: "Resume not found" });
        }

        return res.status(200).json({
            message: 'Resume deleted successfully'
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


// get user resume by id
// GET: /api/resumes/get/:resumeId
export const getResumeById = async (req,res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ userId, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        // remove unwanted fields
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        return res.status(200).json({ resume });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    } 
}


// get public resume by id
// GET: /api/resumes/public/:resumeId
export const getPublicResumeById = async (req,res)=>{
    try {
        const { resumeId } = req.params;

        const resume = await Resume.findOne({ public: true, _id: resumeId });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        return res.status(200).json({ resume });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


// controller for updating a resume
// PUT: /api/resumes/update
export const updateResume = async (req,res)=>{
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        let resumeDataCopy;

        // parse JSON safely
        try {
            resumeDataCopy = JSON.parse(resumeData);
        } catch {
            return res.status(400).json({ message: "Invalid JSON data" });
        }

        // handle image upload
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

            // ensure structure exists
            if (!resumeDataCopy.personal_info) {
                resumeDataCopy.personal_info = {};
            }

            resumeDataCopy.personal_info.image = response.url;
        }

        const resume = await Resume.findOneAndUpdate(
            { userId, _id: resumeId },
            resumeDataCopy,
            { new: true }
        );

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        return res.status(200).json({
            message: 'Saved successfully',
            resume
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
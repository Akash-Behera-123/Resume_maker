import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createResume,
  deleteResume,
  getPublicResumeById,
  getResumeById,
  updateResume
} from "../controllers/resumeController.js";

const resumeRouter = express.Router();

// CREATE
resumeRouter.post('/create', protect, createResume);

// ✅ FIXED: removed multer (THIS WAS CAUSING ERROR)
resumeRouter.put('/update', protect, updateResume);

// DELETE
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);

// GET
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);

export default resumeRouter;
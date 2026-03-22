import express from "express";
import multer from "multer";
import protect from "../middlewares/authMiddleware.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume
} from "../controllers/aiController.js";

const aiRouter = express.Router();

// ✅ IMPORTANT: use memory storage (fixes file.buffer issue)
const upload = multer({ storage: multer.memoryStorage() });

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);

// ✅ Upload route
aiRouter.post(
  '/upload-resume',
  protect,
  upload.single("resume"), 
  uploadResume
);

export default aiRouter;
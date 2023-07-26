import express from "express";
import multer from "multer";
import { createFeedback } from "../controllers/feedbackController";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/feedback", upload.single("image"), createFeedback);

export default router;
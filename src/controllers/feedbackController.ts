import express, { Request, Response } from "express";
import Feedback from "../middlewares/feedbackModel";

export const createFeedback = async (req: Request, res: Response) => {
  const { title, body } = req.body;

  try {
    const feedback = new Feedback({
      title,
      body,
      image: req.file ? req.file.filename : undefined,
    });

    const savedFeedback = await feedback.save();

    return res.status(201).json(savedFeedback);
  } catch (error) {
    console.error("Error saving feedback:", error);
    return res.status(500).json({ error: "Could not save feedback." });
  }
};
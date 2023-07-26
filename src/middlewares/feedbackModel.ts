import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  image: String,
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vote" }],
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
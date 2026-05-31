import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  lessonName: {
    type: String,
    required: true,
  },

  examDate: {
    type: Date,
    required: true,
  },

  knowledgeLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },

  previousGrade: {
    type: Number,
    required: true,
  },

  missingLevel: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
});

const examRequestSchema = new mongoose.Schema(
  {
    dailyStudyHours: {
      type: Number,
      required: true,
    },

    exams: [examSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ExamRequest",
  examRequestSchema
);
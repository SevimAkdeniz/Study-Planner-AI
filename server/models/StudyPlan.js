import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  type: String,
  hours: Number,
});

const lessonPlanSchema = new mongoose.Schema({
  lessonName: String,
  studyHours: Number,
  priority: String,
  tasks: [taskSchema],
});

const dayPlanSchema = new mongoose.Schema({
  date: String,
  lessons: [lessonPlanSchema],
});

const studyPlanSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamRequest",
    },

    plan: [dayPlanSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("StudyPlan", studyPlanSchema);
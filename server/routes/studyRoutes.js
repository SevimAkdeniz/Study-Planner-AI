import express from "express";
import { createStudyPlan } from "../controllers/studyController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Study Planner API çalışıyor",
  });
});

router.post("/create", createStudyPlan);

export default router;
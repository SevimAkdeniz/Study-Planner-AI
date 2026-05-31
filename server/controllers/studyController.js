import ExamRequest from "../models/ExamRequest.js";
import StudyPlan from "../models/StudyPlan.js";
import { exec } from "child_process";

function normalizeDifficulty(value) {
  if (["easy", "medium", "hard"].includes(value)) return value;
  if (value === "Kolay") return "easy";
  if (value === "Orta") return "medium";
  if (value === "Zor") return "hard";
  return "medium";
}

function normalizeMissingLevel(value) {
  if (["low", "medium", "high"].includes(value)) return value;
  if (value === "Az") return "low";
  if (value === "Orta") return "medium";
  if (value === "Çok") return "high";
  return "medium";
}

function calculateDaysLeft(examDate, currentDay = new Date()) {
  const targetDate = new Date(examDate);

  const start = new Date(
    currentDay.getFullYear(),
    currentDay.getMonth(),
    currentDay.getDate()
  );

  const end = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

function predictPriority(exam) {
  return new Promise((resolve, reject) => {
    const daysLeft = calculateDaysLeft(exam.examDate);

    const input = {
      knowledgeLevel: Number(exam.knowledgeLevel),
      difficulty: normalizeDifficulty(exam.difficulty),
      previousGrade: Number(exam.previousGrade),
      missingLevel: normalizeMissingLevel(exam.missingLevel),
      daysLeft,
    };

    const jsonInput = JSON.stringify(input).replace(/"/g, '\\"');
    const command = `python ../ml-model/predict.py "${jsonInput}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log("Python hata:", stderr);
        reject(error);
        return;
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result.priority);
      } catch (err) {
        reject(err);
      }
    });
  });
}

function getPriorityScore(priority) {
  switch (priority) {
    case "very_high":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 1;
  }
}

function getMaxDailyHoursByPriority(priority) {
  switch (priority) {
    case "very_high":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 1;
  }
}

function getUrgencyScore(daysLeft) {
  if (daysLeft <= 0) return 12;
  if (daysLeft <= 1) return 10;
  if (daysLeft <= 2) return 8;
  if (daysLeft <= 3) return 6;
  if (daysLeft <= 5) return 4;
  if (daysLeft <= 10) return 2;
  return 0;
}

function getKnowledgePenalty(knowledgeLevel) {
  return Math.max(0, 5 - Number(knowledgeLevel));
}

function getGradePenalty(previousGrade) {
  const grade = Number(previousGrade);
  if (grade < 40) return 3;
  if (grade < 60) return 2;
  if (grade < 75) return 1;
  return 0;
}

function getMissingPenalty(missingLevel) {
  const normalized = normalizeMissingLevel(missingLevel);
  if (normalized === "high") return 3;
  if (normalized === "medium") return 2;
  return 0;
}

function calculateLessonScore(exam, priority, currentDay) {
  const daysLeft = calculateDaysLeft(exam.examDate, currentDay);

  return (
    getPriorityScore(priority) * 2 +
    getUrgencyScore(daysLeft) * 5 +
    getKnowledgePenalty(exam.knowledgeLevel) +
    getGradePenalty(exam.previousGrade) +
    getMissingPenalty(exam.missingLevel)
  );
}

function roundHour(value) {
  return Number(value.toFixed(1));
}

function generateTasks(exam, studyHours, currentDay) {
  const daysLeft = calculateDaysLeft(exam.examDate, currentDay);
  const knowledge = Number(exam.knowledgeLevel);
  const grade = Number(exam.previousGrade);
  const missing = normalizeMissingLevel(exam.missingLevel);

  let topicRatio = 0.4;
  let questionRatio = 0.4;
  let reviewRatio = 0.2;

  if (knowledge <= 2) {
    topicRatio += 0.2;
    questionRatio += 0.1;
    reviewRatio -= 0.1;
  }

  if (grade < 50) {
    questionRatio += 0.2;
    topicRatio -= 0.1;
  }

  if (missing === "high") {
    topicRatio += 0.1;
    questionRatio += 0.1;
    reviewRatio -= 0.1;
  }

  if (daysLeft <= 3) {
    reviewRatio += 0.2;
    questionRatio += 0.1;
    topicRatio -= 0.2;
  }

  topicRatio = Math.max(0.1, topicRatio);
  questionRatio = Math.max(0.1, questionRatio);
  reviewRatio = Math.max(0.1, reviewRatio);

  const totalRatio = topicRatio + questionRatio + reviewRatio;

  return [
    {
      type: "Konu Çalışma",
      hours: roundHour((topicRatio / totalRatio) * studyHours),
    },
    {
      type: "Soru Çözümü",
      hours: roundHour((questionRatio / totalRatio) * studyHours),
    },
    {
      type: "Tekrar",
      hours: roundHour((reviewRatio / totalRatio) * studyHours),
    },
  ];
}

export const createStudyPlan = async (req, res) => {
  try {
    const { dailyStudyHours, exams } = req.body;

    if (!dailyStudyHours || !exams || exams.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Günlük çalışma saati ve dersler zorunludur.",
      });
    }

    const totalDailyHours = Number(dailyStudyHours);

    const cleanExams = exams.map((exam) => ({
      lessonName: exam.lessonName,
      examDate: exam.examDate,
      knowledgeLevel: Number(exam.knowledgeLevel),
      difficulty: normalizeDifficulty(exam.difficulty),
      previousGrade: Number(exam.previousGrade),
      missingLevel: normalizeMissingLevel(exam.missingLevel),
    }));

    const savedRequest = await ExamRequest.create({
      dailyStudyHours: totalDailyHours,
      exams: cleanExams,
    });

    const lessonPriorities = await Promise.all(
      cleanExams.map(async (exam) => {
        const priority = await predictPriority(exam);

        return {
          lessonName: exam.lessonName,
          priority,
        };
      })
    );

    const generatedPlan = [];
    const today = new Date();

    const latestExamDate = new Date(
      Math.max(...cleanExams.map((exam) => new Date(exam.examDate)))
    );

    for (
      let currentDay = new Date(today);
      currentDay <= latestExamDate;
      currentDay.setDate(currentDay.getDate() + 1)
    ) {
      const currentDate = currentDay.toISOString().split("T")[0];

      const activeLessons = cleanExams
        .map((exam) => {
          const daysLeft = calculateDaysLeft(exam.examDate, currentDay);

          if (daysLeft < 0) return null;

          const priorityInfo = lessonPriorities.find(
            (item) => item.lessonName === exam.lessonName
          );

          const priority = priorityInfo?.priority || "medium";

          return {
            exam,
            lessonName: exam.lessonName,
            priority,
            score: calculateLessonScore(exam, priority, currentDay),
            maxDailyHours: getMaxDailyHoursByPriority(priority),
          };
        })
        .filter(Boolean);

      if (activeLessons.length === 0) continue;

      const totalScore = activeLessons.reduce(
        (sum, lesson) => sum + lesson.score,
        0
      );

      let usedHours = 0;

      const lessonsForDay = activeLessons.map((lesson) => {
        const rawHours = (lesson.score / totalScore) * totalDailyHours;
        const limitedHours = Math.min(rawHours, lesson.maxDailyHours);
        const roundedHours = roundHour(limitedHours);

const finalHours =
  roundedHours > 0 && roundedHours < 0.5
    ? 0.5
    : roundedHours;

        usedHours += finalHours;

        return {
          lessonName: lesson.lessonName,
          priority: lesson.priority,
          studyHours: finalHours,
          tasks: generateTasks(lesson.exam, finalHours, currentDay),
        };
      });

      const remainingHours = roundHour(totalDailyHours - usedHours);

      if (remainingHours > 0) {
        lessonsForDay.push({
          lessonName: "Genel Tekrar / Serbest Çalışma",
          priority: "free",
          studyHours: remainingHours,
          tasks: [
            {
              type: "Genel Tekrar",
              hours: remainingHours,
            },
          ],
        });
      }

      generatedPlan.push({
        date: currentDate,
        lessons: lessonsForDay,
      });
    }

    const savedPlan = await StudyPlan.create({
      requestId: savedRequest._id,
      plan: generatedPlan,
    });

    res.status(201).json({
      success: true,
      studyPlan: savedPlan,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Plan oluşturulamadı",
    });
  }
};
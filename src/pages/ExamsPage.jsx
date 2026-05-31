import { useNavigate } from "react-router-dom";
import { useStudy } from "../context/StudyContext";
import LessonCard from "../components/LessonCard";
import axios from "axios";

export default function ExamsPage() {
  const navigate = useNavigate();

  const {
    exams,
    setExams,
    dailyStudyHours,
    setStudyPlan,
    resetStudyData,
  } = useStudy();

  const emptyExam = {
    lessonName: "",
    examDate: "",
    knowledgeLevel: 3,
    difficulty: "medium",
    previousGrade: "",
    missingLevel: "medium",
  };

  const addExam = () => {
    setExams([...exams, emptyExam]);
  };

  const updateExam = (index, updatedExam) => {
    const newExams = [...exams];
    newExams[index] = updatedExam;
    setExams(newExams);
  };

  const removeExam = (index) => {
    setExams(exams.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    resetStudyData();
    navigate("/");
  };

  const handleSubmit = async () => {
    if (exams.length === 0) {
      alert("Lütfen en az bir ders ekle.");
      return;
    }

    const hasEmpty = exams.some(
      (exam) =>
        !exam.lessonName ||
        !exam.examDate ||
        !exam.knowledgeLevel ||
        !exam.previousGrade
    );

    if (hasEmpty) {
      alert("Lütfen tüm ders bilgilerini doldur.");
      return;
    }

    const cleanExams = exams.map((exam) => ({
      lessonName: exam.lessonName.trim(),
      examDate: exam.examDate,
      knowledgeLevel: Number(exam.knowledgeLevel),
      difficulty: exam.difficulty,
      previousGrade: Number(exam.previousGrade),
      missingLevel: exam.missingLevel,
    }));

    try {
      const response = await axios.post(
        "http://localhost:5000/api/study/create",
        {
          dailyStudyHours: Number(dailyStudyHours),
          exams: cleanExams,
        }
      );

      setStudyPlan(response.data.studyPlan.plan);
      navigate("/result");
    } catch (error) {
      console.log(error);
      alert("Plan oluşturulamadı.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-5 bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-semibold hover:bg-slate-300"
        >
          ← Geri Dön ve Sıfırla
        </button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Derslerini Ekle
            </h1>
            <p className="text-slate-600">
              Her sınav için bilgilerini gir, sistem çalışma önceliğini
              hesaplasın.
            </p>
          </div>

          <button
            onClick={addExam}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            + Ders Ekle
          </button>
        </div>

        <div className="space-y-5">
          {exams.map((exam, index) => (
            <LessonCard
              key={index}
              exam={exam}
              index={index}
              updateExam={updateExam}
              removeExam={removeExam}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700"
        >
          Çalışma Programını Oluştur
        </button>
      </div>
    </div>
  );
}
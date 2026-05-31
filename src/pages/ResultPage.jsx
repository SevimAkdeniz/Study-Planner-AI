import { useNavigate } from "react-router-dom";
import { useStudy } from "../context/StudyContext";

export default function ResultPage() {
  const navigate = useNavigate();
  const { studyPlan, resetStudyData } = useStudy();

  const handleNewPlan = () => {
    resetStudyData();
    navigate("/");
  };

  const formatPriority = (priority) => {
    switch (priority) {
      case "very_high":
        return "Çok Yüksek";
      case "high":
        return "Yüksek";
      case "medium":
        return "Orta";
      case "low":
        return "Düşük";
      case "free":
        return "Serbest";
      default:
        return priority;
    }
  };

  const priorityStyle = (priority) => {
    switch (priority) {
      case "very_high":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      case "free":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const printPlan = () => {
    window.print();
  };

  const normalLessons = studyPlan.flatMap((day) =>
    day.lessons.filter((lesson) => lesson.priority !== "free")
  );

  const uniqueLessonNames = [
    ...new Set(normalLessons.map((lesson) => lesson.lessonName)),
  ];

  const totalStudyHours = normalLessons.reduce(
    (sum, lesson) => sum + Number(lesson.studyHours || 0),
    0
  );

  const lessonTotals = uniqueLessonNames.map((lessonName) => {
    const total = normalLessons
      .filter((lesson) => lesson.lessonName === lessonName)
      .reduce((sum, lesson) => sum + Number(lesson.studyHours || 0), 0);

    return {
      lessonName,
      total: Number(total.toFixed(1)),
    };
  });

  const mostCriticalLesson =
    lessonTotals.length > 0
      ? lessonTotals.reduce((max, lesson) =>
          lesson.total > max.total ? lesson : max
        )
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-6 print:bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 print:shadow-none">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h1 className="text-4xl font-bold text-slate-800">
                Çalışma Programın
              </h1>
              <p className="text-slate-500 mt-2">
                Yapay zeka destekli ders önceliği ve günlük çalışma planı
              </p>
            </div>

            <div className="flex gap-3 print:hidden">
              <button
                onClick={printPlan}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700"
              >
                PDF / Yazdır
              </button>

              <button
                onClick={handleNewPlan}
                className="bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-semibold hover:bg-slate-300"
              >
                Yeni Plan
              </button>
            </div>
          </div>
        </div>

        {studyPlan.length > 0 && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow">
              <p className="text-sm text-slate-500">Toplam Ders</p>
              <h3 className="text-3xl font-bold text-slate-800">
                {uniqueLessonNames.length}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow">
              <p className="text-sm text-slate-500">Toplam Gün</p>
              <h3 className="text-3xl font-bold text-slate-800">
                {studyPlan.length}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow">
              <p className="text-sm text-slate-500">Toplam Çalışma</p>
              <h3 className="text-3xl font-bold text-slate-800">
                {totalStudyHours.toFixed(1)} saat
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow">
              <p className="text-sm text-slate-500">En Kritik Ders</p>
              <h3 className="text-xl font-bold text-blue-600">
                {mostCriticalLesson?.lessonName || "-"}
              </h3>
            </div>
          </div>
        )}

        {studyPlan.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Ders Bazlı Toplam Çalışma
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {lessonTotals.map((lesson) => (
                <div
                  key={lesson.lessonName}
                  className="border border-slate-200 rounded-2xl p-4 bg-slate-50"
                >
                  <h3 className="font-bold text-slate-800">
                    {lesson.lessonName}
                  </h3>
                  <p className="text-blue-600 font-bold mt-2">
                    {lesson.total} saat
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {studyPlan.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <p className="text-slate-600">
              Henüz çalışma programı oluşturulmadı.
            </p>
          </div>
        ) : (
          <div className="space-y-7">
            {studyPlan.map((day, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 print:shadow-none"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-blue-600">
                    {day.date}
                  </h2>

                  <span className="text-sm text-slate-500">
                    {day.lessons.length} çalışma bloğu
                  </span>
                </div>

                <div className="space-y-4">
                  {day.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition bg-slate-50"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-xl text-slate-800">
                            {lesson.lessonName}
                          </h3>

                          <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full border text-sm font-semibold ${priorityStyle(
                              lesson.priority
                            )}`}
                          >
                            Öncelik: {formatPriority(lesson.priority)}
                          </span>
                        </div>

                        <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-lg text-center min-w-[110px]">
                          {lesson.studyHours} saat
                        </div>
                      </div>

                      {lesson.tasks && lesson.tasks.length > 0 && (
                        <div className="mt-5 grid md:grid-cols-3 gap-3">
                          {lesson.tasks.map((task, taskIndex) => (
                            <div
                              key={taskIndex}
                              className="bg-white border border-slate-200 rounded-xl p-4"
                            >
                              <p className="text-sm text-slate-500">
                                {task.type}
                              </p>
                              <p className="text-lg font-bold text-slate-800">
                                {task.hours} saat
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
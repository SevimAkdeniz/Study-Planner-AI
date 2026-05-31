export default function LessonCard({ exam, index, updateExam, removeExam }) {
  const handleChange = (field, value) => {
    updateExam(index, {
      ...exam,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-slate-800">
          Ders {index + 1}
        </h2>

        <button
          onClick={() => removeExam(index)}
          className="text-red-500 text-sm font-medium"
        >
          Sil
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Ders Adı</label>
          <input
            type="text"
            value={exam.lessonName}
            onChange={(e) => handleChange("lessonName", e.target.value)}
            placeholder="Veri Yapıları"
            className="input"
          />
        </div>

        <div>
          <label className="label">Sınav Tarihi</label>
          <input
            type="date"
            value={exam.examDate}
            onChange={(e) => handleChange("examDate", e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="label">Bilgi Seviyesi (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={exam.knowledgeLevel}
            onChange={(e) =>
              handleChange("knowledgeLevel", Number(e.target.value))
            }
            className="input"
          />
        </div>

        <div>
          <label className="label">Zorluk</label>
          <select
            value={exam.difficulty}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            className="input"
          >
            <option value="easy">Kolay</option>
            <option value="medium">Orta</option>
            <option value="hard">Zor</option>
          </select>
        </div>

        <div>
          <label className="label">Önceki Not</label>
          <input
            type="number"
            min="0"
            max="100"
            value={exam.previousGrade}
            onChange={(e) =>
              handleChange("previousGrade", Number(e.target.value))
            }
            placeholder="45"
            className="input"
          />
        </div>

        <div>
          <label className="label">Eksiklik Seviyesi</label>
          <select
            value={exam.missingLevel}
            onChange={(e) => handleChange("missingLevel", e.target.value)}
            className="input"
          >
            <option value="low">Az</option>
            <option value="medium">Orta</option>
            <option value="high">Çok</option>
          </select>
        </div>
      </div>
    </div>
  );
}
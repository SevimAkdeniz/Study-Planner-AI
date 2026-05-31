import { useNavigate } from "react-router-dom";
import { useStudy } from "../context/StudyContext";

export default function Home() {
  const navigate = useNavigate();
  const { dailyStudyHours, setDailyStudyHours, resetStudyData } = useStudy();

  const handleContinue = () => {
    if (!dailyStudyHours || dailyStudyHours <= 0) {
      alert("Lütfen günlük çalışma saatinizi girin.");
      return;
    }

    navigate("/exams");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">
          Akıllı Sınav Haftası Planlayıcı
        </h1>

        <p className="text-slate-600 mb-6">
          Günlük çalışma süreni gir, derslerini ekle ve sana özel çalışma
          programını oluştur.
        </p>

        <label className="block text-sm font-medium text-slate-700 mb-2">
          Günde kaç saat çalışabilirsin?
        </label>

        <input
          type="number"
          min="1"
          value={dailyStudyHours}
          onChange={(e) => setDailyStudyHours(Number(e.target.value))}
          placeholder="Örn: 5"
          className="w-full border rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
        >
          Devam Et
        </button>

        <button
          onClick={resetStudyData}
          className="w-full mt-3 bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300"
        >
          Her Şeyi Sıfırla
        </button>
      </div>
    </div>
  );
}
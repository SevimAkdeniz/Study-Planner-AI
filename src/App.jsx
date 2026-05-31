import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ExamsPage from "./pages/ExamsPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/exams" element={<ExamsPage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}
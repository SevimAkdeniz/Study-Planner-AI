import { createContext, useContext, useState } from "react";

const StudyContext = createContext();

export function StudyProvider({ children }) {
  const [dailyStudyHours, setDailyStudyHours] = useState(5);
  const [exams, setExams] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);

  const resetStudyData = () => {
    setDailyStudyHours(5);
    setExams([]);
    setStudyPlan([]);
  };

  return (
    <StudyContext.Provider
      value={{
        dailyStudyHours,
        setDailyStudyHours,
        exams,
        setExams,
        studyPlan,
        setStudyPlan,
        resetStudyData,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  return useContext(StudyContext);
}
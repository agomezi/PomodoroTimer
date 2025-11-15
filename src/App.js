import "./App.css";
import Timer from "./Timer";
import Settings from "./Settings";
import { useState, useEffect } from "react";
import SettingsContext from "./SettingsContext";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(()=> {
    const savedPreferences = localStorage.getItem("preferredWorkMinutes");
    return savedPreferences ? parseInt(savedPreferences, 10) : 45;
  })
  const [breakMinutes, setBreakMinutes] = useState(()=> {
    const savedPreferences = localStorage.getItem("preferredBreakMinutes");
    return savedPreferences ? parseInt(savedPreferences, 10) : 15;
  });

  useEffect(()=> {
    localStorage.setItem("preferredWorkMinutes", workMinutes);
    localStorage.setItem("preferredBreakMinutes", breakMinutes);
  }, [workMinutes, breakMinutes]);

  return (
    <main>
      <SettingsContext.Provider
        value={{
          showSettings,
          setShowSettings,
          workMinutes,
          breakMinutes,
          setWorkMinutes,
          setBreakMinutes,
        }}
      >
        {showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </main>
  );
}

export default App;

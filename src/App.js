import "./App.css";
import Timer from "./Timer";
import Settings from "./Settings";
import { useState, useEffect } from "react";
import SettingsContext from "./SettingsContext";
import Profiles from "./Profiles";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showProfiles, setShowProfiles] = useState(true);
  const [workMinutes, setWorkMinutes] = useState(()=> {
    const savedPreferences = localStorage.getItem("preferredWorkMinutes");
    return savedPreferences ? parseInt(savedPreferences, 10) : 45;
  })
  const [breakMinutes, setBreakMinutes] = useState(()=> {
    const savedPreferences = localStorage.getItem("preferredBreakMinutes");
    return savedPreferences ? parseInt(savedPreferences, 10) : 15;
  });
  const [profiles,setProfiles] = useState(()=>{
    const savedProfiles = localStorage.getItem("savedProfiles");
    return savedProfiles ? JSON.parse(savedProfiles) : [];
  })

  const [nextId, setNextId] = useState(()=> {
    const profileId = localStorage.getItem("nextProfileId");
    return profileId ? parseInt(profileId, 10) : 1;
  })

  function addProfile(name,workMinutes,breakMinutes){
    const newProfile={
      id: nextId,
      name: name,
      workMinutes: workMinutes,
      breakMinutes: breakMinutes
    };

    setProfiles([...profiles, newProfiles]);
    setProfiles(nextId + 1);

  }

  function applyProfile(profile){
    setWorkMinutes(profile.workMinutes);
    setBreakMinutes(profile.breakMinutes);

    setShowProfiles(false);
  }

  function updateProfile(id, name, workMinutes, breakMinutes){
    const updatedProfiles = profiles.map(profile => {
      if(profile.id === id){
        return {
          ...profile,
          name: name,
          workMinutes: workMinutes,
          breakMinute: breakMinutes,
        };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
  }

  function deleteProfile(id){
    const updatedProfiles = profiles.filter(profile => profile.id !== id);

    setProfiles(updatedProfiles);
  }

  useEffect(()=> {
    localStorage.setItem("preferredWorkMinutes", workMinutes);
    localStorage.setItem("preferredBreakMinutes", breakMinutes);
    localStorage.setItem("savedProfiles", JSON.stringify(profiles));
  }, [workMinutes, breakMinutes, profiles]);

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
          showProfiles,
          setShowProfiles,
          profiles,
          addProfile,
          applyProfile,
          updateProfile,
        }}
      >
        {showProfiles ? <Profiles /> : showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </main>
  );
}

export default App;

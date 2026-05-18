import "./App.css";
import Timer from "./Timer";
import Settings from "./Settings";
import { useState, useEffect, useRef } from "react";
import SettingsContext from "./SettingsContext";
import { useAuth } from "./context/AuthContext";
import { getSettings } from "./api/api";
import Profiles from "./Profiles";
import Login from "./components/Login";
import Register from "./components/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const { user } = useAuth();
  const prevUserRef = useRef(undefined);

  const [showSettings, setShowSettings] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(() => {
    const savedPreferences = localStorage.getItem("preferredWorkMinutes");
    return savedPreferences ? parseInt(savedPreferences, 10) : 45;
  });
  const [breakMinutes, setBreakMinutes] = useState(() => {
    const savedPreferences = localStorage.getItem("preferredBreakMinutes");
    return savedPreferences ? parseInt(savedPreferences, 10) : 15;
  });
  const [profiles, setProfiles] = useState(() => {
    const savedProfiles = localStorage.getItem("savedProfiles");
    return savedProfiles ? JSON.parse(savedProfiles) : [];
  });

  const [nextId, setNextId] = useState(() => {
    const profileId = localStorage.getItem("nextProfileId");
    return profileId ? parseInt(profileId, 10) : 1;
  });

  const setWorkMinutesWithTracking = (value) => {
    setWorkMinutes(value);
    localStorage.setItem("lastAppliedSource", "settings");
    localStorage.removeItem("lastAppliedProfileId");
  };

  const setBreakMinutesWithTracking = (value) => {
    setBreakMinutes(value);
    localStorage.setItem("lastAppliedSource", "settings");
    localStorage.removeItem("lastAppliedProfileId");
  };

  function addProfile(name, workMinutes, breakMinutes) {
    const newProfile = {
      id: nextId,
      name: name,
      workMinutes: workMinutes,
      breakMinutes: breakMinutes,
    };

    setProfiles([...profiles, newProfile]);
    setNextId(nextId + 1);
  }

  function applyProfile(profile) {
    setWorkMinutes(profile.workMinutes);
    setBreakMinutes(profile.breakMinutes);

    localStorage.setItem("lastAppliedSource", "profile");
    localStorage.setItem("lastAppliedProfileId", profile.id);
    localStorage.setItem("preferredWorkMinutes", profile.workMinutes);
    localStorage.setItem("preferredBreakMinutes", profile.breakMinutes);

    setShowProfiles(false);
  }

  function updateProfile(id, name, workMinutes, breakMinutes) {
    const updatedProfiles = profiles.map((profile) => {
      if (profile.id === id) {
        return {
          ...profile,
          name: name,
          workMinutes: workMinutes,
          breakMinutes: breakMinutes,
        };
      }
      return profile;
    });
    setProfiles(updatedProfiles);
  }

  function deleteProfile(id) {
    const updatedProfiles = profiles.filter((profile) => profile.id !== id);

    setProfiles(updatedProfiles);

    const lastAppliedProfileId = localStorage.getItem("lastAppliedProfileId");
    if (lastAppliedProfileId && parseInt(lastAppliedProfileId, 10) === id) {
      localStorage.removeItem("lastAppliedSource");
      localStorage.removeItem("lastAppliedProfileId");
    }
  }

  useEffect(() => {
    localStorage.setItem("preferredWorkMinutes", workMinutes);
    localStorage.setItem("preferredBreakMinutes", breakMinutes);
    localStorage.setItem("savedProfiles", JSON.stringify(profiles));
  }, [workMinutes, breakMinutes, profiles]);

  useEffect(() => {
    if (prevUserRef.current != null && user === null) {
      setWorkMinutes(45);
      setBreakMinutes(15);
      localStorage.removeItem("preferredWorkMinutes");
      localStorage.removeItem("preferredBreakMinutes");
    }
    if (
      (prevUserRef.current == null || prevUserRef.current === undefined) &&
      user != null
    ) {
      const lastAppliedSource = localStorage.getItem("lastAppliedSource");
      if (lastAppliedSource !== "profile") {
        getSettings()
          .then((s) => {
            setWorkMinutes(s.focus_minutes);
            setBreakMinutes(s.short_break_minutes);
          })
          .catch(() => {});
      }
    }
    prevUserRef.current = user;
  }, [user]);

  return (
    <Router>
      <SettingsContext.Provider
        value={{
          showSettings,
          setShowSettings,
          workMinutes,
          breakMinutes,
          setWorkMinutes: setWorkMinutesWithTracking,
          setBreakMinutes: setBreakMinutesWithTracking,
          showProfiles,
          setShowProfiles,
          profiles,
          addProfile,
          applyProfile,
          updateProfile,
          deleteProfile,
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/timer"
            element={
              <main>
                {" "}
                {showProfiles ? (
                  <Profiles />
                ) : showSettings ? (
                  <Settings />
                ) : (
                  <Timer />
                )}
              </main>
            }
          />
          <Route path="/" element={<Navigate to="/timer" replace />} />
        </Routes>
      </SettingsContext.Provider>
    </Router>
  );
}

export default App;

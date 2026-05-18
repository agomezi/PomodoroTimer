import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./Slider.css";
import SettingsContext from "./SettingsContext";
import { useContext, useEffect, useState } from "react";
import BackButton from "./BackButton";
import DefaultButton from "./DefaultButton";
import { useAuth } from "./context/AuthContext";
import { getSettings, updateSettings } from "./api/api";

function Settings() {
  const settingsInfo = useContext(SettingsContext);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;

      setLoading(true);
      setError("");

      try {
        const backendSettings = await getSettings();

        settingsInfo.setWorkMinutes(backendSettings.focus_minutes);
        settingsInfo.setBreakMinutes(backendSettings.short_break_minutes);
        console.log("Settings loaded from backend: ", backendSettings);
      } catch (err) {
        console.error("Failed to load settings: ", err);
        setError("Failed to load your settings. Using default values.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [user]);

  const saveToBackend = async (workMinutes, breakMinutes) => {
    if (!user) return;
    try {
      await updateSettings({
        focus_Minutes: workMinutes,
        short_break_minutes: breakMinutes,
      });

      console.log("Settings saved");
    } catch (err) {
      console.error("Failed to save settings: ", err);
      setError("Failed to save settings to your account.");
    }
  };

  const handleWorkMinutesChange = (newValue) => {
    settingsInfo.setWorkMinutes(newValue);
    saveToBackend(newValue, settingsInfo.breakMinutes);
  };

  const handleBreakMinutesChange = (newValue) => {
    settingsInfo.setBreakMinutes(newValue);
    saveToBackend(settingsInfo.workMinutes, newValue);
  };

  const handleResetToDefaults = () => {
    const defaultWork = 45;
    const defaultBreak = 15;

    settingsInfo.setWorkMinutes(defaultWork);
    settingsInfo.setBreakMinutes(defaultBreak);

    saveToBackend(defaultWork, defaultBreak);
  };

  return (
    <div style={{ textAlign: "left" }}>
      {loading && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            backgroundColor: "#f0f9ff",
            borderRadius: "6px",
            fontSize: "14px",
            color: "#0369a1",
          }}
        >
          Loading your settings...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            backgroundColor: "#fef2f2",
            borderRadius: "6px",
            fontSize: "14px",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {user && (
        <div
          style={{
            padding: "10px",
            marginBottom: "15px",
            backgroundColor: "#f0fdf4",
            borderRadius: "6px",
            fontSize: "14px",
            color: "#166534",
          }}
        >
          ✓ Settings synced to your account
        </div>
      )}

      <label>Work Minutes: {settingsInfo.workMinutes}:00</label>
      <Slider
        className={"slider"}
        value={settingsInfo.workMinutes}
        onChange={handleWorkMinutesChange}
        min={1}
        max={120}
        disabled={loading}
      />

      <label>Break Minutes: {settingsInfo.breakMinutes}:00</label>
      <Slider
        className={"slider green"}
        value={settingsInfo.breakMinutes}
        onChange={handleBreakMinutesChange}
        min={1}
        max={120}
        disabled={loading}
      />
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <BackButton onClick={() => settingsInfo.setShowSettings(false)} />

        <DefaultButton onClick={handleResetToDefaults} />
      </div>
      <div style={{ marginTop: "20px" }}></div>
    </div>
  );
}

export default Settings;

import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./Slider.css";
import SettingsContext from "./SettingsContext";
import { useContext } from "react";
import BackButtion from "./BackButton";

function Settings() {
  const settingsInfo = useContext(SettingsContext);
  return (
    <div style={{ textAlign: "left" }}>
      <label>Work Minutes: {settingsInfo.workMinutes}:00</label>
      <Slider
        className={"slider"}
        value={settingsInfo.workMinutes}
        onChange={(newValue) => settingsInfo.setWorkMinutes(newValue)}
        min={1}
        max={120}
      />

      <label>Break Minutes: {settingsInfo.breakMinutes}:00</label>
      <Slider
        className={"slider green"}
        value={settingsInfo.breakMinutes}
        onChange={(newValue) => settingsInfo.setBreakMinutes(newValue)}
        min={1}
        max={120}
      />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <BackButtion onClick={() => settingsInfo.setShowSettings(false)} />
      </div>
    </div>
  );
}

export default Settings;

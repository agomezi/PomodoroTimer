import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./Slider.css";
import SettingsContext from "./SettingsContext";
import { useContext } from "react";

function Settings() {
  const settingsInfo = useContext(SettingsContext);
  return (
    <div style={{ textAlign: "left" }}>
      <label>Work Minutes: {settingsInfo.workMinutes}</label>
      <Slider
        className={"slider"}
        value={settingsInfo.workMinutes}
        min={1}
        max={120}
      />

      <label>Break Minutes: {settingsInfo.breakMinutes}</label>
      <Slider
        className={"slider green"}
        value={settingsInfo.breakMinutes}
        min={1}
        max={120}
      />
    </div>
  );
}

export default Settings;

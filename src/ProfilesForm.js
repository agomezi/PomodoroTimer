import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./Slider.css";
import { useState, useEffect } from "react";
import BackButton from "./BackButton";

function ProfileForm({ onCancel, onSubmit, initialProfile = null }) {
  const isEditing = initialProfile !== null;

  const [profileName, setProfileName] = useState("");
  const [workMinutes, setWorkMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(15);

  useEffect(() => {
    if (initialProfile) {
      setProfileName(initialProfile.name);
      setWorkMinutes(initialProfile.workMinutes);
      setBreakMinutes(initialProfile.breakMinutes);
    }
  }, [initialProfile]);

  function handleSubmit() {
    if (profileName.trim() === "") {
      alert("Please enter a profile name");
      return;
    }
    onSubmit(profileName, workMinutes, breakMinutes);
    if (!isEditing) {
      setProfileName("");
      setWorkMinutes(45);
      setBreakMinutes(15);
    }
  }

  return (
    <div style={{ textAlign: "left" }}>
      <label>Profile Name:</label>
      <input
        type="text"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        placeholder="Enter profile name"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "none",
          borderRadius: "10px",
          color: "#eee",
          fontSize: "1.4rem",
        }}
      ></input>

      <label>Work Minutes: {workMinutes}:00 </label>
      <Slider
        className={"slider"}
        value={workMinutes}
        onChange={(newValue) => setWorkMinutes(newValue)}
        min={1}
        max={120}
      />

      <label>Break Minutes: {breakMinutes}:00 </label>
      <Slider
        className={"slider green"}
        value={breakMinutes}
        onChange={(newValue) => setBreakMinutes(newValue)}
        min={1}
        max={120}
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
        <BackButton onClick={onCancel} />

        <button className="with-text" onClick={handleSubmit}>
          {isEditing ? "Update Profile" : "Create Profile"}
        </button>
      </div>
    </div>
  );
}

export default ProfileForm;

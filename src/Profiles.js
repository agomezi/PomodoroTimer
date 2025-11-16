import React from "react";
import { useEffect, useContext, useState } from "react";
import SettingsContext from "./SettingsContext";
import Settings from "./Settings";
import AddProfileButton from "./AddProfileButton";
import BackButton from "./BackButton";
import ProfilesForm from "./ProfilesForm";

function Profiles() {
  const {
    profiles,
    addProfile,
    applyProfile,
    updateProfile,
    deleteProfile,
    setShowProfiles,
  } = useContext(SettingsContext);

  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  function handleCreateProfile(name, workMinutes, breakMinutes) {
    addProfile(name, workMinutes, breakMinutes);
    setShowForm(false);
    setEditingProfile(null);
  }

  function handleUpdateProfile(name, workMinutes, breakMinutes) {
    if (editingProfile) {
      updateProfile(editingProfile.id, name, workMinutes, breakMinutes);
      setShowForm(false);
      setEditingProfile(null);
    }
  }

  function handleEdit(profile) {
    setEditingProfile(profile);
    setShowForm(true);
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      deleteProfile(id);
    }
  }

  return (
    <main>
      <div>Create a custom profile for different scenarios</div>
      {showForm ? (
        <ProfilesForm
          onCancel={() => {
            setShowForm(false);
            setEditingProfile(null);
          }}
          onSubmit={editingProfile ? handleUpdateProfile : handleCreateProfile}
          initialProfile={editingProfile}
        />
      ) : (
        <div>
          {profiles.length === 0 ? (
            <div>
              <p>No profiles yet. Create your first one!</p>
              <AddProfileButton onClick={() => setShowForm(true)} />
            </div>
          ) : (
            <>
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "15px",
                  }}
                >
                  <h3>{profile.name}</h3>
                  <p>
                    Work: {profile.workMinutes} min | Break:{" "}
                    {profile.breakMinutes} min
                  </p>
                  <button
                    className="with-text"
                    onClick={() => applyProfile(profile)}
                  >
                    Apply Profile
                  </button>
                  <button
                    className="with-text"
                    onClick={() => handleEdit(profile)}
                  >
                    Edit
                  </button>
                  <button
                    className="with-text"
                    onClick={() => handleDelete(profile.id)}
                    style={{ backgroundColor: "rgba(245, 78, 78, 0.3)" }}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <div style={{ marginTop: "20px" }}>
                <AddProfileButton onClick={() => setShowForm(true)} />
              </div>
            </>
          )}
          <div style={{ marginTop: "20px" }}>
            <BackButton onClick={() => setShowProfiles(false)} />
          </div>
        </div>
      )}
    </main>
  );
}

export default Profiles;

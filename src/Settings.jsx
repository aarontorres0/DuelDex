import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { supabase } from "./supabaseClient";

const Settings = () => {
  const { user } = useAuth();
  const currentEmail = user.email;
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [loadingNewEmail, setLoadingNewEmail] = useState(false);
  const [loadingNewPassword, setLoadingNewPassword] = useState(false);
  const [loadingDeleteBookmarks, setLoadingDeleteBookmarks] = useState(false);
  const [loadingDeleteDeck, setLoadingDeleteDeck] = useState(false);
  const [clearBookmarks, setClearBookmarks] = useState("");
  const [clearDeck, setClearDeck] = useState("");

  const isValidPassword = (password) => {
    return (
      password.length >= 16 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password)
    );
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const updateEmail = async () => {
    if (currentEmail === newEmail) {
      setMessage("Please enter a new email.");
      setAlertType("alert-warning");
      setNewEmail("");
      return;
    }

    if (!isValidEmail(newEmail)) {
      setMessage("Please enter a valid email address.");
      setAlertType("alert-error");
      setNewEmail("");
      return;
    }

    setLoadingNewEmail(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) {
      setMessage("Failed to update email. Please try again.");
      setAlertType("alert-error");
    } else {
      setMessage(
        "Please check your email to confirm the email address change."
      );
      setAlertType("alert-success");
    }
    setNewEmail("");
    setLoadingNewEmail(false);
  };

  const changePassword = async () => {
    if (currentPassword === newPassword) {
      setMessage("Please enter a different password than your current one.");
      setAlertType("alert-warning");
      setNewPassword("");
      return;
    }

    if (!isValidPassword(newPassword)) {
      setMessage("Password must meet the required standards.");
      setAlertType("alert-error");
      setNewPassword("");
      return;
    }

    setLoadingNewPassword(true);

    // Re-authenticate user with old password to confirm identity
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password: currentPassword,
    });

    if (reauthError) {
      setMessage("Failed to verify current password. Please try again.");
      setAlertType("alert-error");
      setLoadingNewPassword(false);
      return;
    }

    // Update password if re-authentication was successful
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      setMessage("Failed to update password. Please try again.");
      setAlertType("alert-error");
    } else {
      setMessage("Password updated successfully!");
      setAlertType("alert-success");
      setCurrentPassword("");
      setNewPassword("");
    }

    setLoadingNewPassword(false);
  };

  const clearUserData = async (tableName) => {
    if (tableName === "bookmarks") {
      setLoadingDeleteBookmarks(true);
      setClearBookmarks("");
    } else {
      setLoadingDeleteDeck(true);
      setClearDeck("");
    }

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("user_id", user.id);

    if (error) {
      setMessage(`Failed to clear cards from ${tableName}. Please try again.`);
      setAlertType("alert-error");
    } else {
      setMessage(`All cards cleared from ${tableName} successfully.`);
      setAlertType("alert-success");
    }

    if (tableName === "bookmarks") {
      setLoadingDeleteBookmarks(false);
    } else {
      setLoadingDeleteDeck(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {message && (
        <div
          role="alert"
          className={`flex alert ${alertType} text-white justify-center`}
        >
          {message}
        </div>
      )}
      <div>
        <h2 className="font-semibold m-2">Update Email</h2>
        <input
          type="email"
          placeholder="New Email"
          className="input input-bordered w-full max-w-xs m-2"
          value={newEmail}
          required
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button
          className="btn btn-primary m-2"
          onClick={updateEmail}
          disabled={!newEmail || loadingNewEmail}
        >
          {loadingNewEmail ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Update Email"
          )}
        </button>
      </div>
      <div className="text-xs text-gray-500 m-2">
        Your current email is {currentEmail}
      </div>
      <div className="mt-4">
        <h2 className="font-semibold m-2">Change Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          className="input input-bordered w-full max-w-xs m-2"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="input input-bordered w-full max-w-xs m-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          className="btn btn-warning text-white m-2"
          onClick={changePassword}
          disabled={!currentPassword || !newPassword || loadingNewPassword}
        >
          {loadingNewPassword ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Change Password"
          )}
        </button>
      </div>
      <div className="text-xs text-gray-500 m-2">
        Password must be at least 16 characters long and include at least one
        uppercase letter, one lowercase letter, one number, and one of the
        following special characters: !@#$%^&*()_+-=[]{};\'\:"|?,./`~
      </div>
      <hr className="my-8" />
      <div>
        <h2 className="font-semibold m-2">Clear Bookmarks</h2>
        <p className="text-xs text-gray-500 m-2">
          Please type <strong>bookmarks</strong> below to confirm you would like
          to clear your bookmarks. This action cannot be undone.
        </p>
        <input
          type="text"
          placeholder="Type confirmation here"
          className="input input-bordered w-full max-w-xs m-2"
          value={clearBookmarks}
          required
          onChange={(e) => setClearBookmarks(e.target.value)}
          disabled={loadingDeleteBookmarks}
        />
        <button
          className={"btn btn-error text-white m-2"}
          onClick={() => clearUserData("bookmarks")}
          disabled={clearBookmarks !== "bookmarks" || loadingDeleteBookmarks}
        >
          {loadingDeleteBookmarks ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Clear Bookmarks"
          )}
        </button>
      </div>
      <div>
        <h2 className="font-semibold m-2">Clear Deck</h2>
        <p className="text-xs text-gray-500 m-2">
          Please type <strong>deck</strong> below to confirm you would like to
          clear your deck. This action cannot be undone.
        </p>
        <input
          type="text"
          placeholder="Type confirmation here"
          className="input input-bordered w-full max-w-xs m-2"
          value={clearDeck}
          required
          onChange={(e) => setClearDeck(e.target.value)}
          disabled={loadingDeleteDeck}
        />
        <button
          className={"btn btn-error text-white m-2"}
          onClick={() => clearUserData("deck")}
          disabled={clearDeck !== "deck" || loadingDeleteDeck}
        >
          {loadingDeleteDeck ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Clear Deck"
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;

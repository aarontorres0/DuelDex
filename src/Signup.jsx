import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const Signup = ({ onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleModalContentClick = (e) => e.stopPropagation();

  const isValidPassword = (password) => {
    return (
      password.length >= 16 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password)
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isValidPassword(password)) {
      setSignupError(
        "Password must be at least 16 characters and include at least one lowercase, one uppercase, one number, and one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setSignupError("");
    setSignupSuccess("");
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      else {
        setSignupSuccess(
          "Signup successful! Check your email for the confirmation link."
        );
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(onClose, 5000);
      }
    } catch (error) {
      setSignupError("Signup failed: " + error.message);
      setPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open" onClick={onClose}>
      <div className="modal-box" onClick={handleModalContentClick}>
        <h3 className="font-bold text-lg">Sign Up</h3>
        <form onSubmit={handleSignup}>
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full"
          />
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input input-bordered w-full"
          />
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input input-bordered w-full"
          />
          <div className="text-xs text-gray-500 mt-1">
            Password must be at least 16 characters long and include at least
            one uppercase letter, one lowercase letter, one number, and one of
            the following special characters: !@#$%^&*()_+-=[]{};\'\:"|?,./`~
          </div>
          <p className="my-4">
            Have an account?{" "}
            <span className="link link-primary" onClick={onSwitchToLogin}>
              Login
            </span>
          </p>
          {signupError && <p className="text-red-500 my-4">{signupError}</p>}
          {signupSuccess && (
            <p className="text-green-500 my-4">{signupSuccess}</p>
          )}
          <div className="modal-action">
            <button
              type="submit"
              disabled={!email || !password || !confirmPassword || loading}
              className={"btn btn-info text-white"}
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Sign Up"
              )}
            </button>
            <button onClick={onClose} className="btn btn-error text-white">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

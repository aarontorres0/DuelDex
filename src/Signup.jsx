import React, { useState } from "react";
import { supabase } from "./supabaseClient";

function Signup({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
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
        setTimeout(() => {
          onClose();
        }, 5000);
      }
    } catch (error) {
      setSignupError("Signup failed: " + error.message);
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
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
          {signupError && <p className="text-red-500 my-4">{signupError}</p>}
          {signupSuccess && (
            <p className="text-green-500 my-4">{signupSuccess}</p>
          )}
          <div className="modal-action">
            <button
              type="submit"
              disabled={!email || !password || loading}
              className={`btn ${loading ? "loading" : "btn-primary"}`}
            >
              Sign Up
            </button>
            <button onClick={onClose} className="btn btn-ghost">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;

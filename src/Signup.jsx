import React, { useState } from "react";
import { supabase } from "./supabaseClient";

function Signup({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      else {
        alert("Signup successful! Check your email for the confirmation link.");
        onClose();
      }
    } catch (error) {
      alert("Error signing up:", error.error_description || error.message);
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
          <div className="modal-action">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Loading..." : "Sign Up"}
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

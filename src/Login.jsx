import React, { useState } from "react";
import { supabase } from "./supabaseClient";

function Login({ setUser, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      setLoginError("Invalid email or password. Please try again.");
      setEmail("");
      setPassword("");
    } else if (data.user) {
      setUser(data.user);
      onClose();
    } else {
      setLoginError("Unexpected error occurred.");
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Login</h3>
        <form onSubmit={handleLogin}>
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input input-bordered w-full"
            required
          />
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input input-bordered w-full"
            required
          />
          {loginError && <p className="text-red-500 my-4">{loginError}</p>}
          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!email || !password}
            >
              Login
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

export default Login;

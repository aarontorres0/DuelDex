import React, { useState } from "react";
import { supabase } from "./supabaseClient";

function Login({ setUser, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) console.error("Login error", error);
    else {
      if (data.user) {
        setUser(data.user);
        onClose();
      } else {
        alert("Login failed, no user data returned.");
      }
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
          />
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
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

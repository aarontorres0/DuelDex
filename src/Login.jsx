import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const Login = ({ onClose, onSwitchToSignup, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

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
    <div className="modal modal-open" onClick={onClose}>
      <div className="modal-box" onClick={handleModalContentClick}>
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
          <p className="my-4">
            Don't have an account?{" "}
            <span className="link link-primary" onClick={onSwitchToSignup}>
              Sign Up
            </span>
          </p>
          {loginError && <p className="text-red-500 my-4">{loginError}</p>}
          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-success text-white"
              disabled={!email || !password}
            >
              Login
            </button>
            <button className="btn btn-error text-white" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

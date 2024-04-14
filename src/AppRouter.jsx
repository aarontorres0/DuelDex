import React, { useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useAuth } from "../AuthContext";
import App from "./App";
import Bookmarks from "./Bookmarks";
import Login from "./Login";
import LogoutButton from "./LogoutButton";
import Signup from "./Signup";

function AppRouter() {
  const { user, setUser } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <Router>
      <div className="flex justify-between items-center container mx-auto px-4 py-2">
        <Link to="/" className="text-2xl font-bold cursor-pointer">
          DuelDex
        </Link>
        <div className="flex space-x-3">
          {user ? (
            <>
              <Link to="/bookmarks" className="btn btn-success text-white">
                Bookmarks
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="btn btn-success text-white"
              >
                Login
              </button>
              <button
                onClick={() => setShowSignup(true)}
                className="btn btn-info text-white ml-2"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
      {showLogin && (
        <Login setUser={setUser} onClose={() => setShowLogin(false)} />
      )}
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;

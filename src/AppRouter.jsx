import React, { useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useAuth } from "../AuthContext";
import App from "./App";
import Bookmarks from "./Bookmarks";
import Deck from "./Deck";
import Login from "./Login";
import LogoutButton from "./LogoutButton";
import Settings from "./Settings";
import Signup from "./Signup";
import "./index.css";

const AppRouter = () => {
  const { user, setUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const switchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <Router basename={process.env.NODE_ENV === "production" ? "/DuelDex" : "/"}>
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold cursor-pointer">
          DuelDex
        </Link>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="btn md:hidden"
          >
            <div className="hamburger">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </button>
          {showMenu && (
            <div className="absolute right-0 w-40 mt-2 shadow-lg bg-white rounded-md z-10">
              {user ? (
                <>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-success-700 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    Home
                  </Link>
                  <Link
                    to="/bookmarks"
                    className="block px-4 py-2 text-sm text-success-700 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    Bookmarks
                  </Link>
                  <Link
                    to="/deck"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    Deck
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-primary-700 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    Settings
                  </Link>
                  <div className="px-4 py-2">
                    <LogoutButton closeMenu={closeMenu} />
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      closeMenu();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setShowSignup(true);
                      closeMenu();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="hidden md:flex space-x-3">
          {user ? (
            <>
              <Link to="/bookmarks" className="btn btn-success text-white">
                Bookmarks
              </Link>
              <Link to="/deck" className="btn btn-info text-white">
                Deck
              </Link>
              <Link to="/settings" className="btn btn-primary text-white">
                Settings
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
        <Login
          setUser={setUser}
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={switchToSignup}
        />
      )}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={switchToLogin}
        />
      )}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/deck" element={<Deck />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

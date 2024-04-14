import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { supabase } from "./supabaseClient";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="btn btn-error text-white">
      Logout
    </button>
  );
};

export default LogoutButton;

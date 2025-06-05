// src/components/AdminDashboardWrapper.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase-client";

export const AdminDashboardWrapper = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== "admin@aiu.edu.my") {
        navigate("/dashboard"); // Redirect non-admins to shared dashboard
      }
    };
    checkAdmin();
  }, [navigate]);

  return children;
};
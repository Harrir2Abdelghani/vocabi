import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const isLoggedIn = localStorage.getItem("vocabiAdminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin-login");
    } else {
      setAllowed(true);
    }
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
        <div className="text-2xl font-bold text-white animate-pulse">
          Checking admin access...
        </div>
      </div>
    );
  }
  if (!allowed) return null;
  return <>{children}</>;
};

export default AdminProtectedRoute;

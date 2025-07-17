import React, { useState } from "react";
import logo from "../Assets/logo.jpg";

const AdminNavbar = ({ onLogout }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow flex items-center justify-between px-6 py-3 z-20">
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Vocabi Logo"
          className="h-10 w-10 rounded-full shadow"
        />
        <span className="text-2xl font-bold text-purple-700 tracking-wide">
          Vocabi <span className="text-xs text-gray-400 ml-2">Admin</span>
        </span>
      </div>
      <div className="relative">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold shadow hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
          onClick={() => setProfileOpen((v) => !v)}
        >
          <span className="hidden sm:inline">Admin</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-30">
            <button
              className="w-full text-left px-4 py-2 hover:bg-purple-100 text-purple-700 font-semibold rounded-t-lg"
              onClick={() => {
                setProfileOpen(false);
                onLogout && onLogout();
              }}
            >
              Logout
            </button>
            {/* Add more admin actions here if needed */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;

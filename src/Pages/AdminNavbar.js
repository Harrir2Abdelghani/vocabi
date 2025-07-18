import React, { useState } from "react";
import logo from "../Assets/logo.jpg";

const AdminNavbar = ({ onLogout, activeSection }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  // Breadcrumbs logic
  const breadcrumbs = [
    { label: "Admin", href: "/admin" },
    { label: activeSection, href: "#" },
  ];

  return (
    <nav className="fixed top-0 left-64 right-0 z-40 flex items-center justify-between px-8 py-4 shadow border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 admin-font">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="Vocabi Logo"
          className="h-8 w-8 rounded-full shadow"
        />
        <nav
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 font-semibold"
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb.label} className="flex items-center">
              {idx > 0 && <span className="mx-2 text-gray-300">/</span>}
              <a
                href={crumb.href}
                className={
                  idx === breadcrumbs.length - 1
                    ? "text-blue-600 dark:text-blue-300"
                    : "hover:underline"
                }
              >
                {crumb.label}
              </a>
            </span>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {activeSection === "Users" && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition-all duration-150">
            + Add User
          </button>
        )}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl font-bold shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-150"
            onClick={() => setProfileOpen((v) => !v)}
          >
            <span className="hidden sm:inline">Admin</span>
            <img
              src={logo}
              alt="Avatar"
              className="h-7 w-7 rounded-full border-2 border-blue-200 dark:border-blue-700"
            />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg border z-30">
              <button
                className="w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 font-semibold rounded-t-lg"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout && onLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

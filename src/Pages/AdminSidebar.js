import React, { useState } from "react";
import logo from "../Assets/logo.jpg";

const navItems = [
  { name: "Dashboard", icon: "📊" },
  { name: "Users", icon: "👤" },
  { name: "Games", icon: "🎮" },
  { name: "Analytics", icon: "📈" },
  { name: "Settings", icon: "⚙️" },
];

const AdminSidebar = ({ active, setActive }) => {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`h-full min-h-screen z-20 transition-all duration-300 ${open ? "w-64" : "w-20"} flex flex-col bg-gradient-to-b from-primary-light/80 via-white/80 to-accent-light/80 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 shadow-2xl rounded-tr-3xl rounded-br-3xl border-r border-white/30 backdrop-blur-lg`}
    >
      <div className="flex items-center gap-3 px-6 py-6">
        <img
          src={logo}
          alt="Vocabi Logo"
          className="h-10 w-10 rounded-full shadow-lg"
        />
        {open && (
          <span className="text-2xl font-heading font-bold text-primary-dark dark:text-primary-light tracking-wide drop-shadow">
            Vocabi <span className="text-xs text-accent-dark ml-2">Admin</span>
          </span>
        )}
      </div>
      <button
        className="p-2 focus:outline-none text-primary-dark dark:text-primary-light hover:bg-primary-light/20 rounded-full m-2 self-end transition-all duration-200"
        onClick={() => setOpen((v) => !v)}
        title={open ? "Collapse" : "Expand"}
      >
        {open ? <span>&#10094;</span> : <span>&#10095;</span>}
      </button>
      <nav className="flex-1 flex flex-col gap-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`flex items-center gap-4 px-6 py-3 rounded-xl font-heading text-lg md:text-xl font-bold transition-all duration-200 shadow-sm border border-transparent ${active === item.name ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg border-primary/60 ring-2 ring-accent/40 scale-105" : "text-primary-dark dark:text-primary-light hover:bg-primary-light/20 hover:text-accent-dark"} ${open ? "" : "justify-center"}`}
            onClick={() => setActive(item.name)}
          >
            <span className="text-2xl md:text-3xl drop-shadow-lg">
              {item.icon}
            </span>
            {open && (
              <span className="tracking-wide drop-shadow-lg animate-fade-in-up">
                {item.name}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;

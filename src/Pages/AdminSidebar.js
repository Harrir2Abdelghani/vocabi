import React from "react";
import logo from "../Assets/logo.jpg";

const navGroups = [
  {
    heading: "Management",
    items: [
      { name: "Dashboard", icon: "📊" },
      { name: "Users", icon: "👤" },
      { name: "Games", icon: "🎮" },
    ],
  },
  {
    heading: "Analytics",
    items: [{ name: "Analytics", icon: "📈" }],
  },
  {
    heading: "Settings",
    items: [{ name: "Settings", icon: "⚙️" }],
  },
];

const AdminSidebar = ({ active, setActive }) => {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 shadow-lg border-r border-gray-200 dark:border-gray-800 flex flex-col z-30 admin-sidebar">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100 dark:border-gray-800">
        <img
          src={logo}
          alt="Vocabi Logo"
          className="h-10 w-10 rounded-full shadow"
        />
        <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-wide font-sans">
          Vocabi <span className="text-xs text-gray-400 ml-2">Admin</span>
        </span>
      </div>
      <nav className="flex-1 flex flex-col gap-6 mt-6 px-2 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.heading} className="mb-2">
            <div className="text-xs font-bold text-gray-400 uppercase px-4 mb-2 tracking-widest">
              {group.heading}
            </div>
            {group.items.map((item) => (
              <button
                key={item.name}
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg text-base font-semibold transition-all duration-150 border border-transparent focus:outline-none ${active === item.name ? "active" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                onClick={() => setActive(item.name)}
                aria-current={active === item.name ? "page" : undefined}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="tracking-wide">{item.name}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;

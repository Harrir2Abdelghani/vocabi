import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChild,
  FaChartPie,
  FaPlus,
  FaSignOutAlt,
  FaCheckCircle,
  FaRegClock,
} from "react-icons/fa";

// Mock data for kid progress
const mockKids = [
  {
    name: "Sarah",
    progress: 80,
    activities: [
      { date: "2024-07-07", activity: "Completed Numbers Quiz", score: 95 },
      { date: "2024-07-06", activity: "Practiced Days of the Week", score: 88 },
    ],
  },
  {
    name: "Adam",
    progress: 60,
    activities: [
      { date: "2024-07-07", activity: "Played Alphabet Puzzle", score: 70 },
      { date: "2024-07-05", activity: "Watched Story Night", score: 100 },
    ],
  },
];

function DonutChart({ percent, color }) {
  // Simple SVG donut chart
  const radius = 28;
  const stroke = 7;
  const norm = 2 * Math.PI * radius;
  const offset = norm - (percent / 100) * norm;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={stroke}
      />
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={norm}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.7s" }}
      />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        fontSize="1.1rem"
        fontWeight="bold"
        fill={color}
      >
        {percent}%
      </text>
    </svg>
  );
}

function ParentPortal() {
  const [tab, setTab] = useState("signin");
  const [isAuth, setIsAuth] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [kids, setKids] = useState(mockKids);

  // Simple mock auth
  const handleAuth = (type) => {
    setError("");
    if (!form.email || !form.password || (type === "signup" && !form.name)) {
      setError("Please fill in all fields.");
      return;
    }
    // TODO: Integrate with backend
    setIsAuth(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add child (mock)
  const handleAddChild = () => {
    setKids([
      ...kids,
      {
        name: `New Child ${kids.length + 1}`,
        progress: 0,
        activities: [],
      },
    ]);
  };

  // Dashboard summary
  const totalKids = kids.length;
  const avgProgress = Math.round(
    kids.reduce((acc, k) => acc + k.progress, 0) / (kids.length || 1)
  );
  const lastActivity = kids
    .flatMap((k) => k.activities)
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  return (
    <div className="parent-portal-bg parent-portal-auth-bg">
      <div className="parent-portal-container parent-portal-auth-card">
        <div className="parent-portal-tabs">
          {!isAuth && (
            <>
              <button
                className={`parent-portal-tab ${tab === "signin" ? "active" : ""}`}
                onClick={() => setTab("signin")}
              >
                Sign In
              </button>
              <button
                className={`parent-portal-tab ${tab === "signup" ? "active" : ""}`}
                onClick={() => setTab("signup")}
              >
                Sign Up
              </button>
            </>
          )}
          {isAuth && (
            <button className="parent-portal-tab active">Dashboard</button>
          )}
        </div>
        {/* Auth Illustration */}
        {!isAuth && (
          <div className="parent-portal-auth-illustration">
            <FaChild size={48} color="#e11d48" />
          </div>
        )}
        {/* Sign In Form */}
        {!isAuth && tab === "signin" && (
          <form
            className="parent-portal-form parent-portal-form-card"
            onSubmit={(e) => {
              e.preventDefault();
              handleAuth("signin");
            }}
            autoComplete="off"
          >
            <div className="parent-portal-input-group">
              <FaEnvelope className="parent-portal-input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className="parent-portal-input-group">
              <FaLock className="parent-portal-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                className="parent-portal-input-icon parent-portal-eye"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={0}
                role="button"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {error && <div className="parent-portal-error">{error}</div>}
            <button type="submit" className="parent-portal-btn">
              Sign In
            </button>
          </form>
        )}
        {/* Sign Up Form */}
        {!isAuth && tab === "signup" && (
          <form
            className="parent-portal-form parent-portal-form-card"
            onSubmit={(e) => {
              e.preventDefault();
              handleAuth("signup");
            }}
            autoComplete="off"
          >
            <div className="parent-portal-input-group">
              <FaUser className="parent-portal-input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="parent-portal-input-group">
              <FaEnvelope className="parent-portal-input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="parent-portal-input-group">
              <FaLock className="parent-portal-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                className="parent-portal-input-icon parent-portal-eye"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={0}
                role="button"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {error && <div className="parent-portal-error">{error}</div>}
            <button type="submit" className="parent-portal-btn">
              Sign Up
            </button>
          </form>
        )}
        {/* Dashboard */}
        {isAuth && (
          <div className="parent-portal-dashboard-wrapper">
            <aside className="parent-portal-sidebar">
              <div className="parent-portal-sidebar-title">Parent Portal</div>
              <button className="parent-portal-sidebar-link active">
                Dashboard
              </button>
              {/* Future: Add more sidebar links here */}
            </aside>
            <main className="parent-portal-dashboard-main">
              <div className="parent-portal-dashboard-header-pro">
                <h2>Welcome, {form.name || form.email}!</h2>
                <button
                  className="parent-portal-btn parent-portal-logout"
                  onClick={() => setIsAuth(false)}
                  title="Log Out"
                >
                  <FaSignOutAlt style={{ marginRight: 6 }} /> Log Out
                </button>
              </div>
              <div className="parent-portal-dashboard-summary-grid">
                <div className="parent-portal-summary-card">
                  <FaChild size={24} color="#e11d48" />
                  <div>
                    <div className="parent-portal-summary-label">
                      Total Kids
                    </div>
                    <div className="parent-portal-summary-value">
                      {totalKids}
                    </div>
                  </div>
                </div>
                <div className="parent-portal-summary-card">
                  <FaChartPie size={24} color="#e11d48" />
                  <div>
                    <div className="parent-portal-summary-label">
                      Avg. Progress
                    </div>
                    <div className="parent-portal-summary-value">
                      {avgProgress}%
                    </div>
                  </div>
                </div>
                <div className="parent-portal-summary-card">
                  <FaRegClock size={24} color="#e11d48" />
                  <div>
                    <div className="parent-portal-summary-label">
                      Last Activity
                    </div>
                    <div className="parent-portal-summary-value">
                      {lastActivity ? (
                        <>
                          {lastActivity.activity} <br />
                          <span style={{ fontSize: "0.9em", color: "#64748b" }}>
                            {lastActivity.date}
                          </span>
                        </>
                      ) : (
                        <span>No activity yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="parent-portal-kids-grid">
                {kids.map((kid, idx) => (
                  <div className="parent-portal-kid-card" key={idx}>
                    <div className="parent-portal-kid-header">
                      <span className="parent-portal-kid-avatar">
                        <FaChild size={28} color="#e11d48" />
                      </span>
                      <h3>{kid.name}</h3>
                      <DonutChart percent={kid.progress} color="#e11d48" />
                    </div>
                    <div className="parent-portal-activities">
                      <strong>Recent Activities:</strong>
                      <ul className="parent-portal-activity-timeline">
                        {kid.activities.length === 0 && (
                          <li>No activities yet.</li>
                        )}
                        {kid.activities.map((a, i) => (
                          <li key={i}>
                            <FaCheckCircle
                              color="#22c55e"
                              style={{ marginRight: 4 }}
                            />
                            <span className="parent-portal-activity-date">
                              {a.date}:
                            </span>{" "}
                            {a.activity} (<b>{a.score}</b>)
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="parent-portal-btn parent-portal-add-child"
                onClick={handleAddChild}
              >
                <FaPlus style={{ marginRight: 6 }} /> Add Child
              </button>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

export default ParentPortal;

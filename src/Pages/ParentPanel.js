import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaLock,
  FaSignOutAlt,
  FaChartBar,
  FaTasks,
  FaAward,
  FaEnvelope,
  FaBell,
  FaChild,
  FaLink,
  FaFilePdf,
  FaCheckCircle,
  FaExclamationCircle,
  FaCog,
  FaEdit,
  FaPlus,
  FaTrash,
  FaMedal,
  FaStar,
  FaEnvelopeOpenText,
  FaFileDownload,
  FaUserEdit,
  FaSyncAlt,
} from "react-icons/fa";

const MOCK_USER = { username: "parent", password: "parent2025" };
const mockInitialUsers = [MOCK_USER];
const mockChildren = [
  {
    name: "Sarah",
    progress: 85,
    weakAreas: ["Animals", "Actions"],
    milestones: ["100 Words Mastered", "7-Day Streak"],
    assignments: [
      { title: "Fruits Quiz", due: "2024-07-10", status: "pending" },
      { title: "Colors Game", due: "2024-07-08", status: "completed" },
    ],
    mastered: ["Apple", "Dog", "Run", "Blue"],
    pending: ["Cat", "Jump", "Yellow"],
    quizScores: [80, 90, 85, 95, 88],
    timeSpent: [20, 25, 30, 15, 22],
  },
  {
    name: "Adam",
    progress: 60,
    weakAreas: ["Colors"],
    milestones: ["50 Words Mastered"],
    assignments: [
      { title: "Animals Quiz", due: "2024-07-09", status: "pending" },
    ],
    mastered: ["Red", "Dog"],
    pending: ["Green", "Cat"],
    quizScores: [60, 70, 65, 75, 68],
    timeSpent: [10, 12, 15, 8, 11],
  },
];

function ProgressGraph({ scores, label, color }) {
  const max = Math.max(...scores, 100);
  const points = scores
    .map((s, i) => `${i * 40},${100 - (s / max) * 80}`)
    .join(" ");
  return (
    <svg
      width="200"
      height="100"
      style={{ background: "#fff", borderRadius: 12 }}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        points={points}
        style={{ transition: "all 0.7s cubic-bezier(.4,2,.6,1)" }}
      />
      <text
        x="10"
        y="20"
        fontSize="14"
        fill={color}
        style={{ fontWeight: 700 }}
      >
        {label}
      </text>
    </svg>
  );
}

function StatusBadge({ status }) {
  const color =
    status === "completed"
      ? "#22c55e"
      : status === "pending"
        ? "#eab308"
        : "#e11d48";
  const bg =
    status === "completed"
      ? "#dcfce7"
      : status === "pending"
        ? "#fef9c3"
        : "#fee2e2";
  return (
    <span
      style={{
        background: bg,
        color,
        borderRadius: 8,
        padding: "2px 12px",
        fontWeight: 700,
        fontSize: 14,
        marginLeft: 8,
        letterSpacing: 0.5,
        transition: "background 0.2s, color 0.2s",
      }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function BarChart({ data, label, color }) {
  // Simple SVG bar chart
  const max = Math.max(...data, 1);
  return (
    <svg
      width="200"
      height="100"
      style={{ background: "#fff", borderRadius: 12 }}
    >
      {data.map((v, i) => (
        <rect
          key={i}
          x={i * 32 + 18}
          y={100 - (v / max) * 80}
          width={20}
          height={(v / max) * 80}
          fill={color}
          rx={6}
        />
      ))}
      <text
        x="10"
        y="20"
        fontSize="14"
        fill={color}
        style={{ fontWeight: 700 }}
      >
        {label}
      </text>
    </svg>
  );
}

const SIDEBAR_SECTIONS = [
  { key: "dashboard", label: "Dashboard", icon: FaChartBar },
  { key: "assignments", label: "Assignments", icon: FaTasks },
  { key: "connect", label: "Connect", icon: FaLink },
  { key: "reports", label: "Reports", icon: FaFilePdf },
  { key: "notifications", label: "Notifications", icon: FaBell },
  { key: "settings", label: "Settings", icon: FaCog },
];

// Helper: mock activity feed
function getMockActivity(child) {
  return [
    {
      type: "quiz",
      text: `Completed ${child.assignments?.[0]?.title || "a quiz"}`,
      date: "2024-07-10",
    },
    { type: "badge", text: "Earned badge: Quiz Master", date: "2024-07-09" },
    {
      type: "assignment",
      text: "Submitted assignment: Colors Game",
      date: "2024-07-08",
    },
    { type: "note", text: "Parent added a note", date: "2024-07-07" },
  ];
}

export default function ParentPanel() {
  const [tab, setTab] = useState("signin");
  const [form, setForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [selectedChild, setSelectedChild] = useState(0);
  const [childSwitching, setChildSwitching] = useState(false);
  const [users, setUsers] = useState(mockInitialUsers);
  const [showSettings, setShowSettings] = useState(false);
  const [children, setChildren] = useState(mockChildren);
  const [editChildIdx, setEditChildIdx] = useState(null);
  const [editChildName, setEditChildName] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");

  // New state for features
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({ title: "", due: "" });
  const [notes, setNotes] = useState({}); // { childName: note }
  const [showToast, setShowToast] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [compareIdx, setCompareIdx] = useState(1);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Auth logic
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSignupChange = (e) =>
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  const handleAuth = (type) => {
    setError("");
    if (!form.username || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (type === "signin") {
      const found = users.find(
        (u) => u.username === form.username && u.password === form.password
      );
      if (found) {
        setIsAuth(true);
        setError("");
      } else {
        setError("Invalid credentials. Try parent / parent2025 or sign up.");
      }
    }
  };
  const handleSignup = (e) => {
    e.preventDefault();
    setSignupError("");
    if (!signupForm.username || !signupForm.password || !signupForm.confirm) {
      setSignupError("Please fill in all fields.");
      return;
    }
    if (signupForm.password !== signupForm.confirm) {
      setSignupError("Passwords do not match.");
      return;
    }
    if (users.some((u) => u.username === signupForm.username)) {
      setSignupError("Username already exists.");
      return;
    }
    setUsers([
      ...users,
      { username: signupForm.username, password: signupForm.password },
    ]);
    setTab("signin");
    setForm({ username: signupForm.username, password: "" });
    setSignupForm({ username: "", password: "", confirm: "" });
    setSignupError("");
  };
  const handleLogout = () => {
    setIsAuth(false);
    setForm({ username: "", password: "" });
    setTab("signin");
  };
  const handleChildSwitch = (idx) => {
    setChildSwitching(true);
    setTimeout(() => {
      setSelectedChild(idx);
      setChildSwitching(false);
    }, 250);
  };
  // Child profile editing
  const startEditChild = (idx) => {
    setEditChildIdx(idx);
    setEditChildName(children[idx].name);
  };
  const saveEditChild = () => {
    setChildren(
      children.map((c, i) =>
        i === editChildIdx ? { ...c, name: editChildName } : c
      )
    );
    setEditChildIdx(null);
    setEditChildName("");
  };
  const cancelEditChild = () => {
    setEditChildIdx(null);
    setEditChildName("");
  };
  const addChild = () => {
    setChildren([
      ...children,
      {
        name: `New Child ${children.length + 1}`,
        progress: 0,
        weakAreas: [],
        milestones: [],
        assignments: [],
        mastered: [],
        pending: [],
        quizScores: [],
        timeSpent: [],
      },
    ]);
  };
  const deleteChild = (idx) => {
    setChildren(children.filter((_, i) => i !== idx));
    if (selectedChild === idx) setSelectedChild(0);
  };

  // Assignment modal logic
  function handleAssignSubmit(e) {
    e.preventDefault();
    setShowAssignModal(false);
    setShowToast("Assignment created (mock)");
    setTimeout(() => setShowToast(""), 2000);
  }
  // PDF/Email mock
  function handleDownloadPDF() {
    setShowToast("PDF downloaded (mock)");
    setTimeout(() => setShowToast(""), 2000);
  }
  function handleSendEmail() {
    setShowToast("Weekly summary sent! (mock)");
    setTimeout(() => setShowToast(""), 2000);
  }
  // Note logic
  function handleNoteChange(childName, value) {
    setNotes({ ...notes, [childName]: value });
  }

  // Animated header background SVG ref and effect
  const headerBgRef = useRef(null);
  useEffect(() => {
    if (headerBgRef.current) {
      headerBgRef.current.animate(
        [
          { transform: "translateY(0px)" },
          { transform: "translateY(10px)" },
          { transform: "translateY(0px)" },
        ],
        {
          duration: 6000,
          iterations: Infinity,
        }
      );
    }
  }, []);

  // Main section renderers
  function renderDashboard(headerBgRef) {
    const child = children[selectedChild];
    const activityFeed = getMockActivity(child); // <-- Ensure this is defined before use
    // Calculate summary stats
    const totalKids = children.length;
    const avgProgress = Math.round(
      children.reduce((acc, k) => acc + (k.progress || 0), 0) /
        (children.length || 1)
    );
    const lastActivity =
      child.assignments && child.assignments.length > 0
        ? child.assignments[0].title
        : "No recent activity";

    return (
      <div
        style={{
          width: "100%",
          maxWidth: "100vw",
          boxSizing: "border-box",
          overflowX: "hidden",
          minWidth: 0,
        }}
      >
        {/* Toast/Alert */}
        {showToast && (
          <div
            style={{
              position: "fixed",
              top: 24,
              right: 24,
              zIndex: 9999,
              background: "#6366f1",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 18,
              boxShadow: "0 2px 16px #6366f188",
              letterSpacing: 1,
            }}
          >
            {showToast}
          </div>
        )}
        {/* Header */}
        <div
          style={{
            width: "100%",
            minHeight: 120,
            background: "linear-gradient(90deg,#6366f1 0%,#e11d48 100%)",
            borderRadius: 32,
            marginBottom: 36,
            display: "flex",
            alignItems: "center",
            padding: "32px 48px",
            boxShadow: "0 8px 32px #6366f133",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated SVG background */}
          <svg
            ref={headerBgRef}
            width="100%"
            height="140"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 1,
              opacity: 0.18,
            }}
          >
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
            <path
              d="M0,80 Q120,140 400,60 T1200,120 V140 H0 Z"
              fill="url(#waveGrad)"
            />
          </svg>
          <div style={{ zIndex: 2 }}>
            <div
              style={{
                fontWeight: 900,
                fontSize: 36,
                color: "#fff",
                letterSpacing: -1,
                marginBottom: 6,
              }}
            >
              Parent Dashboard
            </div>
            <div style={{ color: "#f3f4f6", fontWeight: 600, fontSize: 18 }}>
              Monitor, support, and celebrate your child's vocabulary journey
            </div>
          </div>
          {/* Decorative background circle */}
          <div
            style={{
              position: "absolute",
              right: -80,
              top: -60,
              width: 220,
              height: 220,
              background: "rgba(255,255,255,0.12)",
              borderRadius: "50%",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 0,
            flexWrap: "wrap",
            alignItems: "flex-start",
            width: "100%",
            maxWidth: "100vw",
            boxSizing: "border-box",
            overflowX: "hidden",
            minWidth: 0,
          }}
        >
          {/* Left Column: Child Selector & Summary */}
          <div
            style={{
              flex: "0 0 340px",
              minWidth: 240,
              maxWidth: 380,
              width: "100%",
              boxSizing: "border-box",
              minWidth: 0,
              paddingRight: 32,
              borderRight: "1.5px solid #e5e7eb",
              marginRight: 32,
            }}
          >
            <div style={{ marginBottom: 36 }}>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 24,
                  color: "#e11d48",
                  marginBottom: 18,
                  letterSpacing: -1,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span role="img" aria-label="children">
                  👨‍👩‍👧‍👦
                </span>{" "}
                Your Children
                <button
                  onClick={() => setCompareMode((v) => !v)}
                  style={{
                    marginLeft: "auto",
                    background: compareMode ? "#e11d48" : "#6366f1",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px #6366f122",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FaSyncAlt /> {compareMode ? "Exit Compare" : "Compare"}
                </button>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {children.map((child, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setCompareMode ? setSelectedChild(idx) : null
                    }
                    style={{
                      background:
                        selectedChild === idx
                          ? "linear-gradient(90deg,#6366f1,#e11d48)"
                          : "#fff",
                      color: selectedChild === idx ? "#fff" : "#e11d48",
                      border:
                        selectedChild === idx
                          ? "2.5px solid #6366f1"
                          : "2px solid #e11d48",
                      borderRadius: 16,
                      padding: "14px 22px",
                      fontWeight: 700,
                      fontSize: 18,
                      cursor: "pointer",
                      boxShadow:
                        selectedChild === idx
                          ? "0 4px 16px #6366f122"
                          : "0 2px 8px #e11d4822",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      transition: "all 0.2s",
                      marginBottom: 2,
                      position: "relative",
                    }}
                    disabled={childSwitching}
                  >
                    <span
                      style={{
                        background: selectedChild === idx ? "#fff3" : "#e11d48",
                        color: selectedChild === idx ? "#e11d48" : "#fff",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        marginRight: 10,
                      }}
                    >
                      {child.name[0]}
                    </span>
                    {editChildIdx === idx ? (
                      <input
                        value={editChildName}
                        onChange={(e) => setEditChildName(e.target.value)}
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          border: "none",
                          outline: "none",
                          background: "#fff",
                          color: "#e11d48",
                          borderRadius: 6,
                          padding: "2px 6px",
                          width: 80,
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        {child.name}
                        {/* Badges */}
                        <FaMedal
                          title="Quiz Master"
                          style={{
                            color: "#f59e42",
                            fontSize: 18,
                            marginLeft: 4,
                          }}
                        />
                        <FaStar
                          title="Streak Star"
                          style={{
                            color: "#facc15",
                            fontSize: 18,
                            marginLeft: 2,
                          }}
                        />
                      </span>
                    )}
                    {editChildIdx === idx ? (
                      <>
                        <button
                          onClick={saveEditChild}
                          style={{
                            background: "#22c55e",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 8px",
                            marginLeft: 2,
                            cursor: "pointer",
                          }}
                        >
                          <FaCheckCircle />
                        </button>
                        <button
                          onClick={cancelEditChild}
                          style={{
                            background: "#e11d48",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 8px",
                            marginLeft: 2,
                            cursor: "pointer",
                          }}
                        >
                          <FaTrash />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditChild(idx)}
                          style={{
                            background: "#6366f1",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 8px",
                            marginLeft: 2,
                            cursor: "pointer",
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteChild(idx)}
                          style={{
                            background: "#e11d48",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 8px",
                            marginLeft: 2,
                            cursor: "pointer",
                          }}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </button>
                ))}
                <button
                  onClick={addChild}
                  style={{
                    background: "linear-gradient(90deg,#22c55e,#16a34a)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 14,
                    padding: "12px 20px",
                    fontWeight: 700,
                    fontSize: 17,
                    marginTop: 8,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px #22c55e22",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <FaPlus /> Add Child
                </button>
              </div>
            </div>
            {/* Summary Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 18,
                  padding: 24,
                  boxShadow: "0 4px 24px #6366f122",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  border: "1.5px solid #e5e7eb",
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(135deg,#e11d48,#f472b6)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  <FaChild />
                </span>
                <div>
                  <div
                    style={{ fontWeight: 700, color: "#64748b", fontSize: 15 }}
                  >
                    Total Children
                  </div>
                  <div
                    style={{ fontWeight: 900, color: "#1e293b", fontSize: 26 }}
                  >
                    {totalKids}
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 18,
                  padding: 24,
                  boxShadow: "0 4px 24px #6366f122",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  border: "1.5px solid #e5e7eb",
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#818cf8)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  <FaChartBar />
                </span>
                <div>
                  <div
                    style={{ fontWeight: 700, color: "#64748b", fontSize: 15 }}
                  >
                    Avg. Progress
                  </div>
                  <div
                    style={{ fontWeight: 900, color: "#1e293b", fontSize: 26 }}
                  >
                    {avgProgress}%
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 18,
                  padding: 24,
                  boxShadow: "0 4px 24px #6366f122",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  border: "1.5px solid #e5e7eb",
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(135deg,#eab308,#fde68a)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  <FaTasks />
                </span>
                <div>
                  <div
                    style={{ fontWeight: 700, color: "#64748b", fontSize: 15 }}
                  >
                    Last Activity
                  </div>
                  <div
                    style={{ fontWeight: 900, color: "#1e293b", fontSize: 20 }}
                  >
                    {lastActivity}
                  </div>
                </div>
              </div>
            </div>
            {/* Activity Feed */}
            <div
              style={{
                background: "rgba(255,255,255,0.85)",
                borderRadius: 18,
                padding: 24,
                marginTop: 28,
                boxShadow: "0 4px 16px #6366f122",
                border: "1.5px solid #e5e7eb",
                minHeight: 180,
                position: "relative",
                overflow: "visible",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  color: "#6366f1",
                  fontSize: 20,
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  letterSpacing: 0.5,
                }}
              >
                <FaEnvelopeOpenText style={{ fontSize: 22 }} /> Recent Activity
              </div>
              <div style={{ position: "relative", paddingLeft: 32 }}>
                {/* Vertical timeline line */}
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background:
                      "linear-gradient(180deg,#6366f1 0%,#e11d48 100%)",
                    borderRadius: 2,
                    opacity: 0.18,
                  }}
                />
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {activityFeed.map((a, i) => {
                    let icon, bg, color;
                    if (a.type === "quiz") {
                      icon = <FaChartBar />;
                      bg = "#f3e8ff";
                      color = "#a21caf";
                    }
                    if (a.type === "badge") {
                      icon = <FaMedal />;
                      bg = "#fef9c3";
                      color = "#f59e42";
                    }
                    if (a.type === "assignment") {
                      icon = <FaTasks />;
                      bg = "#e0f2fe";
                      color = "#0284c7";
                    }
                    if (a.type === "note") {
                      icon = <FaUserEdit />;
                      bg = "#f1f5f9";
                      color = "#6366f1";
                    }
                    return (
                      <li
                        key={i}
                        style={{
                          marginBottom: 18,
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                        }}
                      >
                        {/* Timeline dot */}
                        <span
                          style={{
                            position: "absolute",
                            left: -32,
                            top: 10,
                            width: 16,
                            height: 16,
                            background: color,
                            borderRadius: "50%",
                            border: "3px solid #fff",
                            boxShadow: "0 2px 8px #0001",
                            zIndex: 2,
                          }}
                        />
                        {/* Activity card/pill */}
                        <div
                          style={{
                            background: bg,
                            color,
                            borderRadius: 12,
                            padding: "10px 18px",
                            fontWeight: 700,
                            fontSize: 15,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            boxShadow: "0 2px 8px #0001",
                            minWidth: 0,
                            flex: 1,
                            transition: "box-shadow 0.2s",
                            cursor: "pointer",
                          }}
                          tabIndex={0}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.boxShadow =
                              "0 4px 16px #6366f122")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.boxShadow =
                              "0 2px 8px #0001")
                          }
                        >
                          <span style={{ fontSize: 18, color }}>{icon}</span>
                          <span style={{ flex: 1, whiteSpace: "pre-line" }}>
                            {a.text}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              color: "#64748b",
                              fontWeight: 600,
                              marginLeft: 12,
                            }}
                          >
                            {a.date}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            {/* Parent/Teacher Notes */}
            <div
              style={{
                background: "rgba(255,255,255,0.7)",
                borderRadius: 18,
                padding: 20,
                marginTop: 18,
                boxShadow: "0 2px 8px #6366f122",
                border: "1.5px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  color: "#e11d48",
                  fontSize: 18,
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FaUserEdit /> Notes
              </div>
              <textarea
                value={notes[child.name] || ""}
                onChange={(e) => handleNoteChange(child.name, e.target.value)}
                placeholder="Add a note for this child..."
                style={{
                  width: "100%",
                  minHeight: 60,
                  borderRadius: 8,
                  border: "1.5px solid #e5e7eb",
                  padding: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 8,
                  resize: "vertical",
                  background: "#fff",
                }}
              />
            </div>
            {/* Quick Assignment Creation */}
            <button
              onClick={() => setShowAssignModal(true)}
              style={{
                marginTop: 18,
                background: "linear-gradient(90deg,#6366f1,#e11d48)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 24px",
                fontWeight: 800,
                fontSize: 17,
                cursor: "pointer",
                boxShadow: "0 2px 8px #6366f122",
                width: "100%",
              }}
            >
              <FaTasks style={{ marginRight: 8 }} /> Assign New Task
            </button>
            {/* Download PDF & Email Summary */}
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <button
                onClick={handleDownloadPDF}
                style={{
                  background: "linear-gradient(90deg,#6366f1,#e11d48)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 18px",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #6366f122",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FaFileDownload /> Download PDF
              </button>
              <button
                onClick={handleSendEmail}
                style={{
                  background: "linear-gradient(90deg,#eab308,#fde68a)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 18px",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #eab30822",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FaEnvelopeOpenText /> Send Weekly Summary
              </button>
            </div>
          </div>
          {/* Right Column: Analytics */}
          <div
            style={{
              flex: 1,
              minWidth: 220,
              maxWidth: 900,
              width: "100%",
              boxSizing: "border-box",
              minWidth: 0,
              paddingLeft: 0,
            }}
          >
            <div
              style={{
                fontWeight: 900,
                fontSize: 28,
                color: "#6366f1",
                marginBottom: 18,
                letterSpacing: -1,
              }}
            >
              📊 {child.name}'s Analytics
            </div>
            <div
              style={{
                display: "flex",
                gap: 32,
                marginBottom: 32,
                flexWrap: "wrap",
                alignItems: "stretch",
                justifyContent: "center",
              }}
            >
              {/* Progress Graph Card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 22,
                  padding: "32px 24px 24px 24px",
                  flex: "1 1 260px",
                  minWidth: 260,
                  maxWidth: 320,
                  minHeight: 370,
                  boxShadow: "0 4px 32px #6366f122",
                  transition: "box-shadow 0.2s",
                  marginBottom: 16,
                  border: "2.5px solid #6366f1",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  outline: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                tabIndex={0}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 8px 32px #6366f1aa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "0 4px 32px #6366f122")
                }
              >
                <span
                  style={{
                    background: "#e11d48",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    marginBottom: 10,
                  }}
                >
                  <FaChartBar />
                </span>
                <div
                  style={{
                    fontWeight: 800,
                    color: "#6366f1",
                    fontSize: 22,
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Quiz Scores
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    margin: "12px 0",
                  }}
                >
                  <ProgressGraph
                    scores={child.quizScores}
                    label=""
                    color="#e11d48"
                  />
                </div>
                <div
                  style={{
                    marginTop: 8,
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: 17,
                    textAlign: "center",
                  }}
                >
                  Avg. Score:{" "}
                  {child.quizScores.length
                    ? Math.round(
                        child.quizScores.reduce((a, b) => a + b, 0) /
                          child.quizScores.length
                      )
                    : 0}
                  %
                </div>
                <button
                  style={{
                    marginTop: "auto",
                    background: "linear-gradient(90deg,#6366f1,#e11d48)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 22px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px #6366f122",
                    alignSelf: "center",
                  }}
                >
                  View Details
                </button>
              </div>
              {/* Time Spent Bar Chart Card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 22,
                  padding: "32px 24px 24px 24px",
                  flex: "1 1 260px",
                  minWidth: 260,
                  maxWidth: 320,
                  minHeight: 370,
                  boxShadow: "0 4px 32px #eab30822",
                  transition: "box-shadow 0.2s",
                  marginBottom: 16,
                  border: "2.5px solid #eab308",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  outline: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                tabIndex={0}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 8px 32px #eab308aa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "0 4px 32px #eab30822")
                }
              >
                <span
                  style={{
                    background: "#eab308",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    marginBottom: 10,
                  }}
                >
                  <FaTasks />
                </span>
                <div
                  style={{
                    fontWeight: 800,
                    color: "#eab308",
                    fontSize: 22,
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Time Spent
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    margin: "12px 0",
                  }}
                >
                  <BarChart data={child.timeSpent} label="" color="#eab308" />
                </div>
                <div
                  style={{
                    marginTop: 8,
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: 17,
                    textAlign: "center",
                  }}
                >
                  Total: {child.timeSpent.reduce((a, b) => a + b, 0)} min
                </div>
                <button
                  style={{
                    marginTop: "auto",
                    background: "linear-gradient(90deg,#eab308,#fde68a)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 22px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px #eab30822",
                    alignSelf: "center",
                  }}
                >
                  View Details
                </button>
              </div>
              {/* Weak Areas Card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 22,
                  padding: "32px 24px 24px 24px",
                  flex: "1 1 260px",
                  minWidth: 260,
                  maxWidth: 320,
                  minHeight: 370,
                  boxShadow: "0 4px 32px #e11d4822",
                  transition: "box-shadow 0.2s",
                  marginBottom: 16,
                  border: "2.5px solid #e11d48",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  outline: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                tabIndex={0}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 8px 32px #e11d48aa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "0 4px 32px #e11d4822")
                }
              >
                <span
                  style={{
                    background: "#e11d48",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    marginBottom: 10,
                  }}
                >
                  <FaExclamationCircle />
                </span>
                <div
                  style={{
                    fontWeight: 800,
                    color: "#e11d48",
                    fontSize: 22,
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Weak Areas
                </div>
                <div style={{ width: "100%", margin: "12px 0" }}>
                  <ul
                    style={{
                      color: "#e11d48",
                      fontWeight: 700,
                      fontSize: 16,
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      textAlign: "center",
                    }}
                  >
                    {child.weakAreas.map((area, i) => (
                      <li key={i}>
                        <FaExclamationCircle
                          style={{ marginRight: 6, marginBottom: -2 }}
                        />{" "}
                        {area}
                      </li>
                    ))}
                    {child.weakAreas.length === 0 && (
                      <li style={{ color: "#64748b" }}>No weak areas</li>
                    )}
                  </ul>
                </div>
                <button
                  style={{
                    marginTop: "auto",
                    background: "linear-gradient(90deg,#e11d48,#6366f1)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 22px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px #e11d4822",
                    alignSelf: "center",
                  }}
                >
                  View Details
                </button>
              </div>
              {/* Milestones Card */}
              <div
                style={{
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(12px)",
                  borderRadius: 22,
                  padding: "32px 24px 24px 24px",
                  flex: "1 1 260px",
                  minWidth: 260,
                  maxWidth: 320,
                  minHeight: 370,
                  boxShadow: "0 4px 32px #22c55e22",
                  transition: "box-shadow 0.2s",
                  marginBottom: 16,
                  border: "2.5px solid #22c55e",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  outline: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                tabIndex={0}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 8px 32px #22c55eaa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "0 4px 32px #22c55e22")
                }
              >
                <span
                  style={{
                    background: "#22c55e",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    marginBottom: 10,
                  }}
                >
                  <FaCheckCircle />
                </span>
                <div
                  style={{
                    fontWeight: 800,
                    color: "#22c55e",
                    fontSize: 22,
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Milestones
                </div>
                <div style={{ width: "100%", margin: "12px 0" }}>
                  <ul
                    style={{
                      color: "#22c55e",
                      fontWeight: 700,
                      fontSize: 16,
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                      textAlign: "center",
                    }}
                  >
                    {child.milestones.map((m, i) => (
                      <li key={i}>
                        <FaCheckCircle
                          style={{ marginRight: 6, marginBottom: -2 }}
                        />{" "}
                        {m}
                      </li>
                    ))}
                    {child.milestones.length === 0 && (
                      <li style={{ color: "#64748b" }}>No milestones yet</li>
                    )}
                  </ul>
                </div>
                <button
                  style={{
                    marginTop: "auto",
                    background: "linear-gradient(90deg,#22c55e,#16a34a)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 22px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px #22c55e22",
                    alignSelf: "center",
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
          {/* Child Comparison View */}
          {compareMode && children.length > 1 && (
            <div
              style={{
                width: "100%",
                marginTop: 32,
                background: "rgba(255,255,255,0.7)",
                borderRadius: 18,
                padding: 32,
                boxShadow: "0 2px 8px #6366f122",
                border: "1.5px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 24,
                  color: "#6366f1",
                  marginBottom: 18,
                  letterSpacing: -1,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FaSyncAlt /> Compare Children
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 32,
                  width: "100%",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[selectedChild, compareIdx].map((idx, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      borderRadius: 18,
                      padding: 24,
                      minWidth: 220,
                      maxWidth: 320,
                      flex: "1 1 220px",
                      boxShadow: "0 2px 8px #6366f122",
                      border: "1.5px solid #e5e7eb",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 20,
                        color: "#e11d48",
                        marginBottom: 8,
                      }}
                    >
                      {children[idx].name}
                    </div>
                    <div
                      style={{
                        color: "#6366f1",
                        fontWeight: 700,
                        fontSize: 16,
                        marginBottom: 6,
                      }}
                    >
                      Avg. Score:{" "}
                      {children[idx].quizScores.length
                        ? Math.round(
                            children[idx].quizScores.reduce(
                              (a, b) => a + b,
                              0
                            ) / children[idx].quizScores.length
                          )
                        : 0}
                      %
                    </div>
                    <div
                      style={{
                        color: "#eab308",
                        fontWeight: 700,
                        fontSize: 16,
                        marginBottom: 6,
                      }}
                    >
                      Total Time:{" "}
                      {children[idx].timeSpent.reduce((a, b) => a + b, 0)} min
                    </div>
                    <div
                      style={{
                        color: "#22c55e",
                        fontWeight: 700,
                        fontSize: 16,
                        marginBottom: 6,
                      }}
                    >
                      Milestones: {children[idx].milestones.length}
                    </div>
                    <div
                      style={{
                        color: "#e11d48",
                        fontWeight: 700,
                        fontSize: 16,
                        marginBottom: 6,
                      }}
                    >
                      Weak Areas: {children[idx].weakAreas.length}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
                {children.map(
                  (c, idx) =>
                    idx !== selectedChild && (
                      <button
                        key={idx}
                        onClick={() => setCompareIdx(idx)}
                        style={{
                          background:
                            compareIdx === idx ? "#e11d48" : "#6366f1",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 18px",
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: "pointer",
                          boxShadow: "0 2px 8px #6366f122",
                        }}
                      >
                        {c.name}
                      </button>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderAssignments() {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          marginBottom: 32,
          boxShadow: "0 2px 8px #6366f122",
          transition: "box-shadow 0.2s",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: "#6366f1",
            fontSize: 18,
            marginBottom: 8,
          }}
        >
          <FaTasks style={{ marginRight: 8, marginBottom: -2 }} /> Assignments
        </div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}
        >
          <thead>
            <tr style={{ color: "#64748b", fontWeight: 700 }}>
              <th style={{ textAlign: "left", padding: 8 }}>Title</th>
              <th style={{ textAlign: "left", padding: 8 }}>Due</th>
              <th style={{ textAlign: "left", padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {children[selectedChild].assignments.map((a, i) => (
              <tr
                key={i}
                style={{
                  background: i % 2 === 0 ? "#f3f4f6" : "#fff",
                  transition: "background 0.2s",
                }}
              >
                <td style={{ padding: 8 }}>{a.title}</td>
                <td style={{ padding: 8 }}>{a.due}</td>
                <td style={{ padding: 8 }}>
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderConnect() {
    return (
      <div
        style={{
          display: "flex",
          gap: 32,
          marginBottom: 32,
          transition: "gap 0.2s",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 1,
            boxShadow: "0 2px 8px #6366f122",
            transition: "box-shadow 0.2s",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "#6366f1",
              fontSize: 18,
              marginBottom: 8,
            }}
          >
            <FaLink style={{ marginRight: 8, marginBottom: -2 }} /> Connect With
            Child
          </div>
          <div style={{ color: "#64748b", fontWeight: 600, marginBottom: 8 }}>
            Invite by code or email
          </div>
          <input
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              marginBottom: 8,
              fontSize: 15,
              transition: "border 0.2s",
            }}
            placeholder="Enter child code or email (mock)"
          />
          <button
            style={{
              width: "100%",
              padding: 10,
              background: "#e11d48",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Send Invite
          </button>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>
            Privacy-safe: No sensitive data shown
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 1,
            boxShadow: "0 2px 8px #6366f122",
            transition: "box-shadow 0.2s",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "#6366f1",
              fontSize: 18,
              marginBottom: 8,
            }}
          >
            <FaEnvelope style={{ marginRight: 8, marginBottom: -2 }} /> Approve
            Requests
          </div>
          <div style={{ color: "#64748b", fontWeight: 600, marginBottom: 8 }}>
            No pending requests (mock)
          </div>
        </div>
      </div>
    );
  }

  function renderReports() {
    return (
      <div
        style={{
          display: "flex",
          gap: 32,
          marginBottom: 32,
          transition: "gap 0.2s",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 1,
            boxShadow: "0 2px 8px #6366f122",
            transition: "box-shadow 0.2s",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "#e11d48",
              fontSize: 18,
              marginBottom: 8,
            }}
          >
            <FaFilePdf style={{ marginRight: 8, marginBottom: -2 }} />{" "}
            Downloadable PDF Report
          </div>
          <button
            style={{
              width: "100%",
              padding: 10,
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Download (mock)
          </button>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            flex: 1,
            boxShadow: "0 2px 8px #6366f122",
            transition: "box-shadow 0.2s",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "#e11d48",
              fontSize: 18,
              marginBottom: 8,
            }}
          >
            <FaAward style={{ marginRight: 8, marginBottom: -2 }} /> Vocabulary
            Mastered
          </div>
          <div style={{ color: "#22c55e", fontWeight: 600, marginBottom: 4 }}>
            Mastered: {children[selectedChild].mastered.join(", ")}
          </div>
          <div style={{ color: "#e11d48", fontWeight: 600 }}>
            Pending: {children[selectedChild].pending.join(", ")}
          </div>
        </div>
      </div>
    );
  }

  function renderNotifications() {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          marginBottom: 32,
          boxShadow: "0 2px 8px #6366f122",
          transition: "box-shadow 0.2s",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            color: "#6366f1",
            fontSize: 18,
            marginBottom: 8,
          }}
        >
          <FaBell style={{ marginRight: 8, marginBottom: -2 }} /> Notifications
          & Messaging
        </div>
        <div style={{ color: "#64748b", fontWeight: 600, marginBottom: 8 }}>
          No new messages. (mock)
        </div>
        <div style={{ color: "#6366f1", fontWeight: 600, fontSize: 15 }}>
          💬 "Great job this week!"
          <br />
          📩 "Your child scored 80% in Animals Quiz today"
        </div>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          minWidth: 340,
          boxShadow: "0 8px 40px #0002",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontWeight: 900,
            fontSize: 24,
            color: "#e11d48",
            marginBottom: 16,
          }}
        >
          <FaCog style={{ marginRight: 8 }} /> Settings
        </h2>
        <div
          style={{
            color: "#6366f1",
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 24,
          }}
        >
          Account settings and preferences (mock)
        </div>
        <button
          onClick={() => setActiveSection("dashboard")}
          style={{
            background: "#e11d48",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontWeight: 700,
            fontSize: 16,
            marginTop: 8,
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Assignment Modal UI
  {
    showAssignModal && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#0007",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={handleAssignSubmit}
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 36,
            minWidth: 320,
            boxShadow: "0 8px 40px #0002",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontWeight: 900,
              fontSize: 22,
              color: "#e11d48",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            <FaTasks style={{ marginRight: 8 }} /> Assign New Task
          </div>
          <label style={{ fontWeight: 700, color: "#6366f1", fontSize: 16 }}>
            Title
          </label>
          <input
            value={assignForm.title}
            onChange={(e) =>
              setAssignForm({ ...assignForm, title: e.target.value })
            }
            required
            placeholder="e.g. Fruits Quiz"
            style={{
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              padding: 10,
              fontSize: 15,
              fontWeight: 600,
            }}
          />
          <label style={{ fontWeight: 700, color: "#6366f1", fontSize: 16 }}>
            Due Date
          </label>
          <input
            type="date"
            value={assignForm.due}
            onChange={(e) =>
              setAssignForm({ ...assignForm, due: e.target.value })
            }
            required
            style={{
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              padding: 10,
              fontSize: 15,
              fontWeight: 600,
            }}
          />
          <button
            type="submit"
            style={{
              background: "linear-gradient(90deg,#6366f1,#e11d48)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 24px",
              fontWeight: 800,
              fontSize: 17,
              cursor: "pointer",
              boxShadow: "0 2px 8px #6366f122",
              marginTop: 12,
            }}
          >
            Create Assignment
          </button>
          <button
            type="button"
            onClick={() => setShowAssignModal(false)}
            style={{
              background: "#e11d48",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 2px 8px #e11d4822",
              marginTop: 4,
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  function handleLogoutConfirm() {
    setShowLogoutModal(false);
    setIsAuth(false);
    setForm({ username: "", password: "" });
    setTab("signin");
  }

  // Full-width, immersive experience
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      html, body {
        width: 100vw !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #root {
        width: 100vw !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
      }
      * {
        box-sizing: border-box !important;
        min-width: 0 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        maxWidth: "100vw",
        background: "linear-gradient(135deg,#6366f1 0%,#e11d48 100%)",
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        display: "flex",
        alignItems: isAuth ? "stretch" : "center",
        justifyContent: isAuth ? "stretch" : "center",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div
        style={{
          width: isAuth ? "100vw" : 400,
          maxWidth: "100vw",
          background: isAuth ? "transparent" : "#fff",
          borderRadius: isAuth ? 0 : 24,
          boxShadow: isAuth ? "none" : "0 8px 40px #0002",
          padding: isAuth ? 0 : 40,
          margin: 0,
          minHeight: isAuth ? "100vh" : undefined,
          display: isAuth ? undefined : "flex",
          flexDirection: isAuth ? undefined : "column",
          alignItems: isAuth ? undefined : "center",
          justifyContent: isAuth ? undefined : "center",
          transition: "width 0.5s, background 0.5s, border-radius 0.5s",
          overflowX: "hidden",
          boxSizing: "border-box",
          minWidth: 0,
        }}
      >
        {!isAuth && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "70vh",
            }}
          >
            <h1
              style={{
                fontWeight: 900,
                fontSize: 36,
                color: "#e11d48",
                marginBottom: 8,
                letterSpacing: -1,
              }}
            >
              Vocabi Connect
            </h1>
            <div
              style={{
                color: "#6366f1",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 32,
              }}
            >
              Portal for Teachers & Parents
            </div>
            <div style={{ display: "flex", width: "100%", marginBottom: 24 }}>
              <button
                onClick={() => setTab("signin")}
                style={{
                  flex: 1,
                  padding: 12,
                  border: "none",
                  borderRadius: 8,
                  background: tab === "signin" ? "#e11d48" : "#f3f4f6",
                  color: tab === "signin" ? "#fff" : "#e11d48",
                  fontWeight: 700,
                  fontSize: 16,
                  marginRight: 4,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab("signup")}
                style={{
                  flex: 1,
                  padding: 12,
                  border: "none",
                  borderRadius: 8,
                  background: tab === "signup" ? "#e11d48" : "#f3f4f6",
                  color: tab === "signup" ? "#fff" : "#e11d48",
                  fontWeight: 700,
                  fontSize: 16,
                  marginLeft: 4,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                Sign Up
              </button>
            </div>
            {tab === "signin" && (
              <form
                style={{ width: "100%" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAuth(tab);
                }}
              >
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{ fontWeight: 600, color: "#374151", fontSize: 15 }}
                  >
                    Username
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#f3f4f6",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginTop: 4,
                    }}
                  >
                    <FaUser style={{ color: "#6366f1", marginRight: 8 }} />
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="parent"
                      style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 16,
                        width: "100%",
                      }}
                      autoFocus
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{ fontWeight: 600, color: "#374151", fontSize: 15 }}
                  >
                    Password
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#f3f4f6",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginTop: 4,
                    }}
                  >
                    <FaLock style={{ color: "#6366f1", marginRight: 8 }} />
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="parent2025"
                      style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 16,
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
                {error && (
                  <div
                    style={{
                      color: "#e11d48",
                      fontWeight: 600,
                      marginBottom: 12,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: 14,
                    background: "linear-gradient(90deg,#6366f1,#e11d48)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 18,
                    border: "none",
                    borderRadius: 8,
                    marginTop: 8,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px #e11d4822",
                    transition: "background 0.2s, box-shadow 0.2s",
                  }}
                >
                  Sign In
                </button>
              </form>
            )}
            {tab === "signup" && (
              <form style={{ width: "100%" }} onSubmit={handleSignup}>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{ fontWeight: 600, color: "#374151", fontSize: 15 }}
                  >
                    Username
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#f3f4f6",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginTop: 4,
                    }}
                  >
                    <FaUser style={{ color: "#6366f1", marginRight: 8 }} />
                    <input
                      name="username"
                      value={signupForm.username}
                      onChange={handleSignupChange}
                      placeholder="Choose a username"
                      style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 16,
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{ fontWeight: 600, color: "#374151", fontSize: 15 }}
                  >
                    Password
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#f3f4f6",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginTop: 4,
                    }}
                  >
                    <FaLock style={{ color: "#6366f1", marginRight: 8 }} />
                    <input
                      name="password"
                      type="password"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      placeholder="Choose a password"
                      style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 16,
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{ fontWeight: 600, color: "#374151", fontSize: 15 }}
                  >
                    Confirm Password
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#f3f4f6",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginTop: 4,
                    }}
                  >
                    <FaLock style={{ color: "#6366f1", marginRight: 8 }} />
                    <input
                      name="confirm"
                      type="password"
                      value={signupForm.confirm}
                      onChange={handleSignupChange}
                      placeholder="Confirm password"
                      style={{
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 16,
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
                {signupError && (
                  <div
                    style={{
                      color: "#e11d48",
                      fontWeight: 600,
                      marginBottom: 12,
                      textAlign: "center",
                    }}
                  >
                    {signupError}
                  </div>
                )}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: 14,
                    background: "linear-gradient(90deg,#6366f1,#e11d48)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 18,
                    border: "none",
                    borderRadius: 8,
                    marginTop: 8,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px #e11d4822",
                    transition: "background 0.2s, box-shadow 0.2s",
                  }}
                >
                  Sign Up
                </button>
              </form>
            )}
            <div
              style={{
                marginTop: 32,
                color: "#64748b",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              <FaAward
                style={{ color: "#e11d48", marginBottom: -3, marginRight: 4 }}
              />{" "}
              Secure, privacy-first connection for parents & teachers
            </div>
          </div>
        )}
        {isAuth && (
          <div
            style={{
              display: "flex",
              height: "100vh",
              borderRadius: 0,
              overflow: "hidden",
            }}
          >
            {/* Sidebar */}
            <aside
              style={{
                width: 260,
                minWidth: 260,
                maxWidth: 260,
                background: "#fff",
                color: "#6366f1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 48,
                paddingBottom: 36,
                paddingLeft: 0,
                paddingRight: 0,
                position: "sticky",
                left: 0,
                top: 0,
                height: "100vh",
                zIndex: 10,
                boxShadow: "2px 0 16px #e11d4822",
                borderRight: "1.5px solid #e5e7eb",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 28,
                  marginBottom: 40,
                  letterSpacing: -1,
                  textShadow: "0 2px 8px #0001",
                  color: "#e11d48",
                }}
              >
                Vocabi Connect
              </div>
              <div style={{ width: "100%", marginBottom: 32, flex: 1 }}>
                {SIDEBAR_SECTIONS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      padding: "14px 32px",
                      background:
                        activeSection === key
                          ? "linear-gradient(90deg,#e11d48 0%,#6366f1 100%)"
                          : "#fff",
                      color: activeSection === key ? "#fff" : "#6366f1",
                      fontWeight: 700,
                      fontSize: 17,
                      border: "none",
                      borderLeft:
                        activeSection === key
                          ? "5px solid #6366f1"
                          : "5px solid transparent",
                      borderRadius: "0 24px 24px 0",
                      marginBottom: 8,
                      cursor: "pointer",
                      boxShadow:
                        activeSection === key ? "0 2px 8px #e11d4822" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon style={{ marginRight: 16, fontSize: 20 }} /> {label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                style={{
                  width: "90%",
                  background: "#e11d48",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "16px 0",
                  fontWeight: 800,
                  fontSize: 18,
                  marginTop: "auto",
                  marginBottom: 0,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #e11d4822",
                  transition: "background 0.2s, color 0.2s",
                  position: "relative",
                  left: 0,
                  right: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <FaSignOutAlt style={{ marginRight: 8 }} />
                Logout
              </button>
            </aside>
            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "#0007",
                  zIndex: 10000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    padding: 36,
                    minWidth: 320,
                    boxShadow: "0 8px 40px #0002",
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: 22,
                      color: "#e11d48",
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    Are you sure you want to log out?
                  </div>
                  <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                    <button
                      onClick={handleLogoutConfirm}
                      style={{
                        background: "#e11d48",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "12px 24px",
                        fontWeight: 800,
                        fontSize: 17,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #e11d4822",
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowLogoutModal(false)}
                      style={{
                        background: "#6366f1",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "12px 24px",
                        fontWeight: 800,
                        fontSize: 17,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #6366f122",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Main Dashboard */}
            <main
              style={{
                flex: 1,
                background: "#f3f4f6",
                padding: 40,
                overflowY: "auto",
                overflowX: "hidden",
                minWidth: 0,
                maxWidth: "100vw",
                transition: "background 0.3s",
                boxSizing: "border-box",
              }}
            >
              {activeSection === "dashboard" && renderDashboard(headerBgRef)}
              {activeSection === "assignments" && renderAssignments()}
              {activeSection === "connect" && renderConnect()}
              {activeSection === "reports" && renderReports()}
              {activeSection === "notifications" && renderNotifications()}
              {activeSection === "settings" && renderSettings()}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

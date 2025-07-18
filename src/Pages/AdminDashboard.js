import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function downloadCSV(data, filename) {
  const csvRows = [];
  const headers = Object.keys(data[0] || {}).join(",");
  csvRows.push(headers);
  for (const row of data) {
    csvRows.push(
      Object.values(row)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
  }
  const csv = csvRows.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-bold transition-all duration-300 ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
  >
    {message}
    <button
      className="ml-4 text-white/80 hover:text-white font-bold"
      onClick={onClose}
    >
      ×
    </button>
  </div>
);

const AdminDashboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deletingGame, setDeletingGame] = useState(null);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("vocabiAdminTheme") || "light"
  );
  const [gamesPage, setGamesPage] = useState(1);
  const gamesPerPage = 10;
  const totalGamesPages = Math.ceil(games.length / gamesPerPage);
  const paginatedGames = games.slice(
    (gamesPage - 1) * gamesPerPage,
    gamesPage * gamesPerPage
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("vocabiAdminTheme", theme);
  }, [theme]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from("user_profiles")
        .select("id, name, score, level, games_completed")
        .order("score", { ascending: false })
        .limit(100);
      if (leaderboardError) throw leaderboardError;
      setLeaderboard(leaderboardData || []);

      const { data: gamesData, error: gamesError } = await supabase
        .from("game_sessions")
        .select(
          "id, device_id, game_name, difficulty, score, completed, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(100);
      if (gamesError) throw gamesError;
      setGames(gamesData || []);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This cannot be undone."
      )
    )
      return;
    setDeletingUser(userId);
    try {
      await supabase.from("user_profiles").delete().eq("id", userId);
      setLeaderboard(leaderboard.filter((u) => u.id !== userId));
      showToast("User deleted", "success");
    } catch (err) {
      showToast("Failed to delete user", "error");
    } finally {
      setDeletingUser(null);
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm("Are you sure you want to delete this game session?"))
      return;
    setDeletingGame(gameId);
    try {
      await supabase.from("game_sessions").delete().eq("id", gameId);
      setGames(games.filter((g) => g.id !== gameId));
      showToast("Game session deleted", "success");
    } catch (err) {
      showToast("Failed to delete game", "error");
    } finally {
      setDeletingGame(null);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    showToast("Data refreshed", "success");
  };

  const handleLogout = () => {
    localStorage.removeItem("vocabiAdminLoggedIn");
    window.location.href = "/admin-login";
  };

  const handleEditUser = (user) => setEditUser(user);
  const handleEditUserSave = async () => {
    if (!editUser) return;
    try {
      await supabase
        .from("user_profiles")
        .update({
          name: editUser.name,
          score: editUser.score,
          level: editUser.level,
          games_completed: editUser.games_completed,
        })
        .eq("id", editUser.id);
      setLeaderboard(
        leaderboard.map((u) => (u.id === editUser.id ? editUser : u))
      );
      setEditUser(null);
      showToast("User updated", "success");
    } catch (err) {
      showToast("Failed to update user", "error");
    }
  };

  // Chart Data
  const barData = {
    labels: leaderboard.slice(0, 8).map((u) => u.name),
    datasets: [
      {
        label: "Score",
        data: leaderboard.slice(0, 8).map((u) => u.score),
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderRadius: 8,
      },
    ],
  };
  const pieData = {
    labels: Array.from(new Set(games.map((g) => g.game_name))),
    datasets: [
      {
        label: "Games Played",
        data: Array.from(new Set(games.map((g) => g.game_name))).map(
          (name) => games.filter((g) => g.game_name === name).length
        ),
        backgroundColor: [
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(251, 191, 36, 0.7)",
          "rgba(244, 63, 94, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Stats cards
  const totalUsers = leaderboard.length;
  const totalGames = games.length;
  const totalScore = leaderboard.reduce((a, b) => a + (b.score || 0), 0);
  const avgScore = totalUsers ? Math.round(totalScore / totalUsers) : 0;
  const topUser = leaderboard[0]?.name || "-";

  // Filtered users
  const filteredUsers = leaderboard.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex admin-font">
      <AdminSidebar
        active={activeSection}
        setActive={setActiveSection}
        theme={theme}
        setTheme={setTheme}
      />
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        <AdminNavbar onLogout={handleLogout} activeSection={activeSection} />
        <main className="flex-1 p-8 md:p-12 flex flex-col items-center bg-transparent">
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}
          <div className="w-full max-w-6xl mx-auto admin-card p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="admin-heading text-3xl md:text-4xl mb-10 text-center">
                Vocabi Admin Dashboard
              </h1>
              {loading ? (
                <div className="text-center text-xl text-primary-dark dark:text-primary-light animate-pulse">
                  Loading dashboard data...
                </div>
              ) : error ? (
                <div className="text-center text-red-600 font-bold">
                  {error}
                </div>
              ) : (
                <>
                  {activeSection === "Dashboard" && (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                          <div className="text-3xl mb-2">👤</div>
                          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                            {totalUsers}
                          </div>
                          <div className="text-gray-500 dark:text-gray-300">
                            Users
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                          <div className="text-3xl mb-2">🎮</div>
                          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            {totalGames}
                          </div>
                          <div className="text-gray-500 dark:text-gray-300">
                            Games
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                          <div className="text-3xl mb-2">⭐</div>
                          <div className="text-2xl font-bold text-pink-700 dark:text-pink-300">
                            {avgScore}
                          </div>
                          <div className="text-gray-500 dark:text-gray-300">
                            Avg. Score
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                          <div className="text-3xl mb-2">🏆</div>
                          <div className="text-lg font-bold text-green-700 dark:text-green-300">
                            {topUser}
                          </div>
                          <div className="text-gray-500 dark:text-gray-300">
                            Top User
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                          <h2 className="text-xl font-semibold mb-4 text-pink-600 dark:text-pink-300 flex items-center gap-2">
                            Top Scores <span className="text-xs">🏆</span>
                          </h2>
                          <Bar
                            data={barData}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: { display: false },
                                title: { display: false },
                              },
                              scales: { y: { beginAtZero: true } },
                            }}
                          />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                          <h2 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-300 flex items-center gap-2">
                            Games Played <span className="text-xs">🎮</span>
                          </h2>
                          <Pie
                            data={pieData}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: { position: "bottom" },
                                title: { display: false },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {activeSection === "Users" && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-semibold text-pink-600 dark:text-pink-300 flex items-center gap-2">
                            Users <span className="text-xs">👤</span>
                          </h2>
                          <input
                            type="text"
                            placeholder="Search users..."
                            className="ml-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              downloadCSV(filteredUsers, "users.csv")
                            }
                            className="px-3 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg font-bold shadow hover:from-blue-400 hover:to-green-400 transition-all duration-200"
                          >
                            Export CSV
                          </button>
                          <button
                            onClick={() =>
                              downloadJSON(filteredUsers, "users.json")
                            }
                            className="px-3 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg font-bold shadow hover:from-purple-400 hover:to-pink-400 transition-all duration-200"
                          >
                            Export JSON
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-purple-100 dark:bg-purple-900/40">
                              <th className="px-3 py-2 text-left">#</th>
                              <th className="px-3 py-2 text-left">Name</th>
                              <th className="px-3 py-2 text-left">Score</th>
                              <th className="px-3 py-2 text-left">Level</th>
                              <th className="px-3 py-2 text-left">Games</th>
                              <th className="px-3 py-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.map((user, idx) => (
                              <tr
                                key={user.id}
                                className={
                                  idx % 2 === 0
                                    ? "bg-white dark:bg-gray-900/40"
                                    : "bg-purple-50 dark:bg-purple-900/10"
                                }
                              >
                                <td className="px-3 py-2 font-bold">
                                  {idx + 1}
                                </td>
                                <td className="px-3 py-2">{user.name}</td>
                                <td className="px-3 py-2 text-purple-700 dark:text-purple-300 font-bold">
                                  {user.score}
                                </td>
                                <td className="px-3 py-2">{user.level}</td>
                                <td className="px-3 py-2">
                                  {user.games_completed}
                                </td>
                                <td className="px-3 py-2 flex gap-2">
                                  <button
                                    onClick={() => handleEditUser({ ...user })}
                                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-150 text-xs font-bold"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className={`px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition-all duration-150 text-xs font-bold ${deletingUser === user.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={deletingUser === user.id}
                                  >
                                    {deletingUser === user.id
                                      ? "Deleting..."
                                      : "Delete"}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {editUser && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 w-full max-w-md">
                            <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">
                              Edit User
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-semibold mb-1">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
                                  value={editUser.name}
                                  onChange={(e) =>
                                    setEditUser({
                                      ...editUser,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold mb-1">
                                  Score
                                </label>
                                <input
                                  type="number"
                                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
                                  value={editUser.score}
                                  onChange={(e) =>
                                    setEditUser({
                                      ...editUser,
                                      score: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold mb-1">
                                  Level
                                </label>
                                <input
                                  type="number"
                                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
                                  value={editUser.level}
                                  onChange={(e) =>
                                    setEditUser({
                                      ...editUser,
                                      level: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold mb-1">
                                  Games Completed
                                </label>
                                <input
                                  type="number"
                                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
                                  value={editUser.games_completed}
                                  onChange={(e) =>
                                    setEditUser({
                                      ...editUser,
                                      games_completed: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                              <button
                                onClick={() => setEditUser(null)}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-bold"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleEditUserSave}
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold shadow hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {activeSection === "Games" && (
                    <div className="admin-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-300 flex items-center gap-2">
                          Game Sessions <span className="text-xs">🎮</span>
                        </h2>
                        <div className="flex gap-2">
                          <button
                            onClick={() => downloadCSV(games, "games.csv")}
                            className="px-3 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg font-bold shadow hover:from-blue-400 hover:to-green-400 transition-all duration-200"
                          >
                            Export CSV
                          </button>
                          <button
                            onClick={() => downloadJSON(games, "games.json")}
                            className="px-3 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg font-bold shadow hover:from-purple-400 hover:to-pink-400 transition-all duration-200"
                          >
                            Export JSON
                          </button>
                          <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow hover:from-purple-500 hover:to-blue-500 font-bold transition-all duration-200 flex items-center gap-2"
                            disabled={refreshing || loading}
                          >
                            {refreshing ? "Refreshing..." : "Refresh"}
                            <span className="ml-1">🔄</span>
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-blue-100 dark:bg-blue-900/40">
                              <th className="px-3 py-2 text-left">Game</th>
                              <th className="px-3 py-2 text-left">User</th>
                              <th className="px-3 py-2 text-left">
                                Difficulty
                              </th>
                              <th className="px-3 py-2 text-left">Score</th>
                              <th className="px-3 py-2 text-left">Completed</th>
                              <th className="px-3 py-2 text-left">Date</th>
                              <th className="px-3 py-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedGames.map((game, idx) => (
                              <tr
                                key={game.id}
                                className={
                                  idx % 2 === 0
                                    ? "bg-white dark:bg-gray-900/40"
                                    : "bg-blue-50 dark:bg-blue-900/10"
                                }
                              >
                                <td className="px-3 py-2">{game.game_name}</td>
                                <td className="px-3 py-2">{game.device_id}</td>
                                <td className="px-3 py-2">{game.difficulty}</td>
                                <td className="px-3 py-2 text-blue-700 dark:text-blue-300 font-bold">
                                  {game.score}
                                </td>
                                <td className="px-3 py-2">
                                  {game.completed ? "✅" : "❌"}
                                </td>
                                <td className="px-3 py-2">
                                  {new Date(game.created_at).toLocaleString()}
                                </td>
                                <td className="px-3 py-2">
                                  <button
                                    onClick={() => handleDeleteGame(game.id)}
                                    className={`px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition-all duration-150 text-xs font-bold ${deletingGame === game.id ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={deletingGame === game.id}
                                  >
                                    {deletingGame === game.id
                                      ? "Deleting..."
                                      : "Delete"}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* Pagination Controls */}
                      <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                          className="admin-btn px-4 py-2"
                          onClick={() =>
                            setGamesPage((p) => Math.max(1, p - 1))
                          }
                          disabled={gamesPage === 1}
                        >
                          Previous
                        </button>
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          Page {gamesPage} of {totalGamesPages}
                        </span>
                        <button
                          className="admin-btn px-4 py-2"
                          onClick={() =>
                            setGamesPage((p) =>
                              Math.min(totalGamesPages, p + 1)
                            )
                          }
                          disabled={gamesPage === totalGamesPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  {activeSection === "Analytics" && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                      <h2 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-300 flex items-center gap-2">
                        Analytics <span className="text-xs">📈</span>
                      </h2>
                      <div className="w-full flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">
                            Top Scores
                          </h3>
                          <Bar
                            data={barData}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: { display: false },
                                title: { display: false },
                              },
                              scales: { y: { beginAtZero: true } },
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">
                            Games Played
                          </h3>
                          <Pie
                            data={pieData}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: { position: "bottom" },
                                title: { display: false },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeSection === "Settings" && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center">
                      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        Settings <span className="text-xs">⚙️</span>
                      </h2>
                      <div className="flex flex-col gap-4 w-full max-w-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Theme</span>
                          <button
                            onClick={() =>
                              setTheme(theme === "dark" ? "light" : "dark")
                            }
                            className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow hover:from-pink-500 hover:to-purple-500 transition-all duration-200"
                          >
                            {theme === "dark" ? "Light" : "Dark"}
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Admin</span>
                          <span className="text-purple-700 dark:text-purple-300 font-bold">
                            vocabi-admin
                          </span>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold shadow hover:from-pink-500 hover:to-purple-500 transition-all duration-200 mt-4"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

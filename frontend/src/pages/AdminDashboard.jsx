/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const [s, u] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
      ]);
      setStats(s.data.stats);
      setUsers(u.data.users);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to load admin data");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeRole = async (id, userType) => {
    try {
      await api.put(`/admin/users/${id}/role`, { userType });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Role change failed");
    }
  };

  const toggleBlock = async (id) => {
    try {
      await api.put(`/admin/users/${id}/block`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Block toggle failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      {msg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">{msg}</div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Users", stats.users],
            ["Restaurants", stats.restaurants],
            ["Foods", stats.foods],
            ["Orders", stats.orders],
            ["Revenue", `$${(stats.totalRevenue || 0).toFixed(2)}`],
          ].map(([label, val]) => (
            <div key={label} className="card text-center">
              <p className="text-3xl font-bold text-red-500">{val}</p>
              <p className="text-sm text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left py-2">Username</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Role</th>
              <th className="text-left py-2">Blocked</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="py-2">{u.username}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">
                  <select
                    value={u.userType}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    className="border rounded px-1 py-0.5 text-xs"
                  >
                    <option>client</option>
                    <option>vendor</option>
                    <option>delivery</option>
                    <option>admin</option>
                  </select>
                </td>
                <td className="py-2">{u.isBlocked ? "🚫" : "✅"}</td>
                <td className="py-2">
                  <button
                    onClick={() => toggleBlock(u._id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

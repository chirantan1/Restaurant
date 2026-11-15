/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback, useMemo } from "react";
import api from "../api";

const CURRENCY = "$";

const ROLE_STYLES = {
  admin: {
    label: "Admin",
    dot: "bg-[#7a5e9c]",
    badge: "text-[#4c3968] bg-[#eee8f4] border-[#d8cbe6]",
  },
  vendor: {
    label: "Vendor",
    dot: "bg-[#c48f4a]",
    badge: "text-[#8a5e2e] bg-[#f6ecdd] border-[#e6d3b8]",
  },
  delivery: {
    label: "Delivery",
    dot: "bg-[#4a5e9c]",
    badge: "text-[#2f3d70] bg-[#e7eaf4] border-[#cbd2e8]",
  },
  client: {
    label: "Customer",
    dot: "bg-[#4a7c9c]",
    badge: "text-[#2e5670] bg-[#e7eff4] border-[#cbdde8]",
  },
};

const ROLE_OPTIONS = ["client", "vendor", "delivery", "admin"];

const STAT_META = [
  { key: "users", label: "Users", format: (v) => v ?? 0 },
  { key: "restaurants", label: "Restaurants", format: (v) => v ?? 0 },
  { key: "foods", label: "Foods", format: (v) => v ?? 0 },
  { key: "orders", label: "Orders", format: (v) => v ?? 0 },
  {
    key: "totalRevenue",
    label: "Revenue",
    format: (v) => `${CURRENCY}${(Number(v) || 0).toFixed(2)}`,
  },
];

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="border-b border-[#e8e2db] pb-10 mb-10">
          <div className="h-3 w-16 bg-[#f0ece7] animate-pulse mb-4" />
          <div className="h-12 w-2/3 bg-[#f0ece7] animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-[#f0ece7] animate-pulse" />
          ))}
        </div>
        <div className="h-80 bg-[#f0ece7] animate-pulse" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState(null);

  const load = useCallback(async () => {
    try {
      const [s, u] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
      ]);
      setStats(s.data.stats);
      setUsers(u.data.users);
      setMsg("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeRole = async (id, userType) => {
    if (busyUserId) return;
    try {
      setBusyUserId(id);
      await api.put(`/admin/users/${id}/role`, { userType });
      await load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Role change failed");
    } finally {
      setBusyUserId(null);
    }
  };

  const toggleBlock = async (id) => {
    if (busyUserId) return;
    try {
      setBusyUserId(id);
      await api.put(`/admin/users/${id}/block`);
      await load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Block toggle failed");
    } finally {
      setBusyUserId(null);
    }
  };

  const roleCounts = useMemo(() => {
    const c = { client: 0, vendor: 0, delivery: 0, admin: 0, blocked: 0 };
    users.forEach((u) => {
      if (u.isBlocked) c.blocked += 1;
      if (c[u.userType] !== undefined) c[u.userType] += 1;
    });
    return c;
  }, [users]);

  if (loading) return <Skeleton />;

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        {/* ===== HEADER ===== */}
        <header className="border-b border-[#e8e2db] pb-10 mb-10">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            Administration
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
              Platform{" "}
              <span className="italic font-normal text-[#8b7e72]">
                oversight.
              </span>
            </h1>
            <p className="text-sm text-[#4a423c] font-light leading-relaxed max-w-sm">
              Monitor activity, manage accounts, and keep the marketplace
              healthy.
            </p>
          </div>
        </header>

        {/* ===== ALERTS ===== */}
        {msg && (
          <div
            role="alert"
            className="mb-8 border-l-[3px] border-[#b03e2e] bg-[#f5ebe8] px-4 py-3 text-sm text-[#7a2a1f] flex items-start gap-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#b03e2e] mt-2 shrink-0" />
            <span className="leading-relaxed flex-1">{msg}</span>
            <button
              onClick={() => setMsg("")}
              className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-[#a03e2e] hover:text-[#7a2a1f] transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ===== STATS ===== */}
        {stats && (
          <section className="mb-10">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-serif text-2xl tracking-tight">Overview</h2>
              <span className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-[#b8a99c]">
                All time
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {STAT_META.map((s) => (
                <div
                  key={s.key}
                  className="border border-[#e8e2db] bg-white p-5 hover:border-[#1e1b1a] transition-colors duration-200"
                >
                  <p className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-[#8b7e72] mb-2">
                    {s.label}
                  </p>
                  <p className="font-serif text-3xl font-medium leading-none tracking-tight tabular-nums">
                    {s.format(stats[s.key])}
                  </p>
                </div>
              ))}
            </div>

            {/* Secondary breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
              {[
                {
                  label: "Customers",
                  value: roleCounts.client,
                  dot: ROLE_STYLES.client.dot,
                },
                {
                  label: "Vendors",
                  value: roleCounts.vendor,
                  dot: ROLE_STYLES.vendor.dot,
                },
                {
                  label: "Delivery",
                  value: roleCounts.delivery,
                  dot: ROLE_STYLES.delivery.dot,
                },
                {
                  label: "Admins",
                  value: roleCounts.admin,
                  dot: ROLE_STYLES.admin.dot,
                },
                {
                  label: "Blocked",
                  value: roleCounts.blocked,
                  dot: "bg-[#a03e2e]",
                },
              ].map((r) => (
                <div
                  key={r.label}
                  className="border border-[#e8e2db] bg-[#f5f1ec] px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${r.dot}`}
                    />
                    <span className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#6b625a] truncate">
                      {r.label}
                    </span>
                  </div>
                  <span className="font-serif text-lg font-medium tabular-nums">
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== USERS TABLE ===== */}
        <section className="border border-[#e8e2db] bg-white">
          <div className="flex items-baseline justify-between border-b border-[#e8e2db] px-6 py-4">
            <h2 className="font-serif text-xl tracking-tight">Users</h2>
            <span className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-[#b8a99c]">
              {users.length} total
            </span>
          </div>

          {users.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-serif text-xl tracking-tight mb-2">
                No users yet
              </p>
              <p className="text-sm text-[#8b7e72] font-light">
                Registered accounts will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e8e2db]">
                    {["Username", "Email", "Role", "Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-6 py-3 text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-[#8b7e72]"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const role = ROLE_STYLES[u.userType] || ROLE_STYLES.client;
                    const busy = busyUserId === u._id;
                    return (
                      <tr
                        key={u._id}
                        className={`border-b border-[#e8e2db] last:border-0 transition-colors duration-150 ${
                          busy ? "opacity-50" : "hover:bg-[#f5f1ec]/60"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#f0ece7] flex items-center justify-center text-[0.7rem] font-semibold text-[#1e1b1a] shrink-0">
                              {(u.username || "?").charAt(0).toUpperCase()}
                            </span>
                            <span className="font-medium text-[#1e1b1a] truncate max-w-[140px]">
                              {u.username}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-[#4a423c] truncate max-w-[200px] inline-block align-middle">
                            {u.email}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="relative inline-block">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.1em] uppercase border ${role.badge}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${role.dot}`}
                              />
                              {role.label}
                            </span>
                            <select
                              value={u.userType}
                              onChange={(e) =>
                                changeRole(u._id, e.target.value)
                              }
                              disabled={busy}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                              aria-label={`Change role for ${u.username}`}
                            >
                              {ROLE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {ROLE_STYLES[opt]?.label || opt}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {u.isBlocked ? (
                            <span className="inline-flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#7a2a1f]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#a03e2e]" />
                              Blocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#2d522d]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c4a]" />
                              Active
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleBlock(u._id)}
                            disabled={busy}
                            className={`inline-flex items-center justify-center text-[0.65rem] font-semibold tracking-[0.14em] uppercase px-4 py-2 border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                              u.isBlocked
                                ? "border-[#d9d2cb] text-[#1e1b1a] hover:border-[#1e1b1a] hover:bg-[#1e1b1a]/[0.03]"
                                : "border-[#d9d2cb] text-[#7a2a1f] hover:border-[#b03e2e] hover:bg-[#f5ebe8]"
                            }`}
                          >
                            {busy ? "…" : u.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Footer */}
        <p className="mt-8 text-center text-[0.7rem] text-[#8b7e72] tracking-wide">
          Changes take effect immediately across the platform.
        </p>
      </div>
    </div>
  );
}

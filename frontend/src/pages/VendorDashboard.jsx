import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const CURRENCY = "$"; // change to "₹" if you want rupees

// Order status flow + colours
const STATUS = {
  pending: {
    label: "Pending",
    badge: "bg-amber-100 text-amber-800 ring-amber-200",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-sky-100 text-sky-800 ring-sky-200",
    dot: "bg-sky-500",
  },
  preparing: {
    label: "Preparing",
    badge: "bg-violet-100 text-violet-800 ring-violet-200",
    dot: "bg-violet-500",
  },
  delivering: {
    label: "On the way",
    badge: "bg-indigo-100 text-indigo-800 ring-indigo-200",
    dot: "bg-indigo-500",
  },
  delivered: {
    label: "Delivered",
    badge: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-rose-100 text-rose-800 ring-rose-200",
    dot: "bg-rose-500",
  },
};
const STEPS = ["pending", "confirmed", "preparing", "delivering", "delivered"];

const FILTERS = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "delivered",
  "cancelled",
];

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

/* ---------- small presentational helpers ---------- */

function StatCard({ icon, label, value, gradient }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white shadow-lg ${gradient}`}
    >
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/15" />
      <div className="absolute -bottom-6 right-6 h-16 w-16 rounded-full bg-white/10" />
      <div className="relative">
        <div className="text-2xl sm:text-3xl">{icon}</div>
        <p className="mt-2 text-2xl sm:text-3xl font-extrabold leading-none">
          {value}
        </p>
        <p className="mt-1 text-xs sm:text-sm font-medium text-white/85">
          {label}
        </p>
      </div>
    </div>
  );
}

function StatusStepper({ status }) {
  if (status === "cancelled") return null;
  const current = STEPS.indexOf(status);
  return (
    <div
      className="flex items-center gap-1 sm:gap-2"
      aria-label={`Order progress: ${STATUS[status]?.label}`}
    >
      {STEPS.map((s, i) => (
        <div key={s} className="flex flex-1 items-center gap-1 sm:gap-2">
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= current
                ? "bg-gradient-to-r from-orange-400 to-rose-500"
                : "bg-slate-200"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

function ActionButton({ onClick, disabled, className, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {disabled ? "Updating…" : children}
    </button>
  );
}

/* ---------- main component ---------- */

export default function VendorDashboard() {
  // Tabs: "restaurants" | "orders"
  const [activeTab, setActiveTab] = useState("restaurants");

  // --- Restaurants State ---
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    title: "",
    foodType: "",
    image: "",
    delivery: true,
    pickup: false,
  });

  // --- Orders State ---
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersMsg, setOrdersMsg] = useState("");
  const [busyOrderId, setBusyOrderId] = useState(null); // prevents double-clicks
  const [filter, setFilter] = useState("all");

  // Fetch Restaurants
  const loadRestaurants = async () => {
    try {
      const res = await api.get("/restaurant/getmyrestaurants");
      setRestaurants(res.data.restaurants || []);
    } catch (error) {
      console.error("Error loading restaurants:", error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Orders
  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersMsg("");
      const res = await api.get("/order/vendor-orders");
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrdersMsg(error.response?.data?.message || "Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Initial load (orders too, so the header stats and tab badge are correct)
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        await Promise.all([loadRestaurants(ignore), loadOrders(ignore)]);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  // Refresh orders when the tab is opened
  useEffect(() => {
    if (activeTab !== "orders") return;

    let ignore = false;

    const fetchOrders = async () => {
      await loadOrders(ignore);
    };

    fetchOrders();

    return () => {
      ignore = true;
    };
  }, [activeTab]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Create Restaurant
  const create = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const restaurantData = {
        title: form.title.trim(),
        foodType: form.foodType
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        image: form.image.trim(),
        delivery: form.delivery,
        pickup: form.pickup,
      };

      if (!restaurantData.foodType.length) {
        setMsg("Please enter at least one food type");
        return;
      }

      await api.post("/restaurant/create", restaurantData);
      setMsg("Restaurant created successfully!");
      setForm({
        title: "",
        foodType: "",
        image: "",
        delivery: true,
        pickup: false,
      });
      setShowForm(false);
      await loadRestaurants();
    } catch (error) {
      console.error("Create restaurant error:", error);
      setMsg(error.response?.data?.message || "Failed to create restaurant");
    }
  };

  // Delete Restaurant
  const remove = async (id) => {
    if (!window.confirm("Delete this restaurant and all its foods?")) return;
    try {
      await api.delete(`/restaurant/delete/${id}`);
      setMsg("Restaurant deleted successfully!");
      await loadRestaurants();
    } catch (error) {
      console.error("Delete restaurant error:", error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  // Update Order Status
  const updateOrderStatus = async (id, status) => {
    if (busyOrderId) return;
    try {
      setBusyOrderId(id);
      await api.put(`/order/update-status/${id}`, { status });
      await loadOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order");
    } finally {
      setBusyOrderId(null);
    }
  };

  /* ---------- derived data ---------- */
  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === "pending").length,
    [orders],
  );
  const revenue = useMemo(
    () =>
      orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0),
    [orders],
  );
  const counts = useMemo(() => {
    const c = { all: orders.length };
    orders.forEach((o) => (c[o.status] = (c[o.status] || 0) + 1));
    return c;
  }, [orders]);
  const visibleOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const msgIsError = /fail|please|error/i.test(msg);

  return (
    <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-8">
      {/* ===== Hero + stats ===== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 p-5 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-yellow-300/20" />
        <div className="relative">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
            Vendor Dashboard
          </h1>
          <p className="mt-1 max-w-xl text-sm text-white/85 sm:text-base">
            Manage your restaurants, update menus and keep every order moving.
          </p>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2 sm:gap-4">
          <StatCard
            icon="🏪"
            label="Restaurants"
            value={restaurants.length}
            gradient="bg-white/15 backdrop-blur ring-1 ring-white/25 shadow-none"
          />
          <StatCard
            icon="🔔"
            label="Pending orders"
            value={pendingCount}
            gradient="bg-white/15 backdrop-blur ring-1 ring-white/25 shadow-none"
          />
          <StatCard
            icon="💰"
            label="Delivered revenue"
            value={`${CURRENCY}${revenue.toFixed(0)}`}
            gradient="bg-white/15 backdrop-blur ring-1 ring-white/25 shadow-none"
          />
        </div>
      </section>

      {/* ===== Tabs ===== */}
      <div
        className="mt-6 flex gap-1 rounded-2xl bg-slate-100 p-1.5 shadow-inner"
        role="tablist"
      >
        {[
          {
            id: "restaurants",
            label: "My Restaurants",
            icon: "🍽️",
            count: restaurants.length,
          },
          {
            id: "orders",
            label: "Incoming Orders",
            icon: "🧾",
            count: orders.length,
          },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 sm:text-base ${
              activeTab === t.id
                ? "bg-white text-orange-600 shadow"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <span aria-hidden>{t.icon}</span>
            <span className="truncate">{t.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === t.id
                  ? "bg-orange-100 text-orange-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ============ RESTAURANTS TAB ============ */}
      {activeTab === "restaurants" && (
        <div className="mt-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Your restaurants
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 ${
                showForm
                  ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  : "bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:brightness-110"
              }`}
            >
              {showForm ? "Cancel" : "+ Add restaurant"}
            </button>
          </div>

          {msg && (
            <div
              role="status"
              className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
                msgIsError
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <span aria-hidden>{msgIsError ? "⚠️" : "✅"}</span>
              {msg}
            </div>
          )}

          {showForm && (
            <form
              onSubmit={create}
              className="mb-8 space-y-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-lg sm:p-7"
            >
              <h3 className="text-lg font-bold text-slate-800">
                New restaurant
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Restaurant name
                  </label>
                  <input
                    type="text"
                    name="title"
                    className={inputCls}
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Food types{" "}
                    <span className="font-normal text-slate-400">
                      (comma-separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="foodType"
                    className={inputCls}
                    value={form.foodType}
                    onChange={handleChange}
                    placeholder="pizza, italian, fast-food"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  className={inputCls}
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://picsum.photos/seed/rest/800/600"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {[
                  { name: "delivery", label: "🛵 Delivery" },
                  { name: "pickup", label: "🛍️ Pickup" },
                ].map((opt) => (
                  <label
                    key={opt.name}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      form[opt.name]
                        ? "border-orange-300 bg-orange-50 text-orange-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={opt.name}
                      checked={form[opt.name]}
                      onChange={handleChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
              >
                Create restaurant
              </button>
            </form>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-3xl bg-white shadow"
                >
                  <div className="h-44 bg-slate-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/50 px-6 py-14 text-center">
              <div className="text-5xl">🍕</div>
              <p className="mt-3 text-lg font-bold text-slate-800">
                No restaurants yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add your first restaurant to start receiving orders.
              </p>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110"
                >
                  + Add restaurant
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {restaurants.map((r) => (
                <article
                  key={r._id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-orange-300 via-rose-300 to-fuchsia-300">
                    {r.image ? (
                      <img
                        src={r.image}
                        alt={r.title}
                        loading="lazy"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl">
                        🍽️
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {r.delivery && (
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow">
                          🛵 Delivery
                        </span>
                      )}
                      {r.pickup && (
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-sky-700 shadow">
                          🛍️ Pickup
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="truncate text-lg font-bold text-slate-800">
                      {r.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.foodType?.map((t, i) => (
                        <span
                          key={t + i}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            [
                              "bg-orange-100 text-orange-700",
                              "bg-violet-100 text-violet-700",
                              "bg-teal-100 text-teal-700",
                              "bg-pink-100 text-pink-700",
                            ][i % 4]
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex gap-2">
                      <Link
                        to={`/vendor/restaurants/${r._id}`}
                        className="flex-1 rounded-xl bg-slate-900 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
                      >
                        Manage menu
                      </Link>
                      <button
                        onClick={() => remove(r._id)}
                        className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============ ORDERS TAB ============ */}
      {activeTab === "orders" && (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Incoming orders
            </h2>
            <button
              onClick={loadOrders}
              disabled={ordersLoading}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {ordersLoading ? "Refreshing…" : "↻ Refresh"}
            </button>
          </div>

          {/* Filter chips */}
          <div className="-mx-3 mb-5 flex gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  filter === f
                    ? "bg-slate-900 text-white shadow"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {f !== "all" && (
                  <span className={`h-2 w-2 rounded-full ${STATUS[f].dot}`} />
                )}
                {f === "all" ? "All" : STATUS[f].label}
                <span
                  className={`${filter === f ? "text-white/70" : "text-slate-400"}`}
                >
                  {counts[f] || 0}
                </span>
              </button>
            ))}
          </div>

          {ordersMsg && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              ⚠️ {ordersMsg}
            </div>
          )}

          {ordersLoading && orders.length === 0 ? (
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="animate-pulse space-y-3 rounded-3xl bg-white p-5 shadow"
                >
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-200" />
                  <div className="h-3 w-2/3 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-sky-200 bg-sky-50/50 px-6 py-14 text-center">
              <div className="text-5xl">🧾</div>
              <p className="mt-3 text-lg font-bold text-slate-800">
                {orders.length === 0
                  ? "No orders yet"
                  : "No orders in this filter"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {orders.length === 0
                  ? "New customer orders will show up here."
                  : "Pick another status above to see more orders."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {visibleOrders.map((order) => {
                const st = STATUS[order.status] || STATUS.pending;
                const busy = busyOrderId === order._id;
                return (
                  <article
                    key={order._id}
                    className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-slate-100"
                  >
                    <div className={`h-1.5 ${st.dot}`} />
                    <div className="p-5 sm:p-6">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-extrabold text-slate-800">
                            Order #{order._id.slice(-6)}
                          </h3>
                          <p className="truncate text-sm font-semibold text-orange-600">
                            🏪 {order.restaurant?.title || "Unknown"}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${st.badge}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </div>

                      {/* Customer info */}
                      <div className="mt-4 grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
                        <p>
                          <span className="mr-1">👤</span>
                          <span className="font-semibold text-slate-800">
                            {order.buyer?.username || "Unknown"}
                          </span>
                        </p>
                        <p>
                          <span className="mr-1">📞</span>
                          {order.phone}
                        </p>
                        <p className="sm:col-span-2">
                          <span className="mr-1">📍</span>
                          {order.deliveryAddress}
                        </p>
                      </div>

                      {/* Progress */}
                      <div className="mt-4">
                        <StatusStepper status={order.status} />
                      </div>

                      {/* Items */}
                      <div className="mt-4">
                        <p className="mb-2 text-sm font-bold text-slate-700">
                          Items
                        </p>
                        <ul className="divide-y divide-slate-100 text-sm">
                          {order.items?.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between gap-3 py-2"
                            >
                              <span className="flex min-w-0 items-center gap-2">
                                <span className="rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                                  {item.quantity}×
                                </span>
                                <span className="truncate text-slate-700">
                                  {item.food?.title || "Item"}
                                </span>
                              </span>
                              <span className="font-semibold text-slate-600">
                                {CURRENCY}
                                {item.price}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-50 to-rose-50 px-4 py-3">
                          <span className="text-sm font-semibold text-slate-600">
                            Total
                          </span>
                          <span className="text-xl font-extrabold text-slate-900">
                            {CURRENCY}
                            {order.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {order.status === "pending" && (
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <ActionButton
                            onClick={() =>
                              updateOrderStatus(order._id, "confirmed")
                            }
                            disabled={busy}
                            className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-200"
                          >
                            ✓ Accept
                          </ActionButton>
                          <ActionButton
                            onClick={() =>
                              updateOrderStatus(order._id, "cancelled")
                            }
                            disabled={busy}
                            className="bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-200"
                          >
                            ✕ Reject
                          </ActionButton>
                        </div>
                      )}

                      {order.status === "confirmed" && (
                        <ActionButton
                          onClick={() =>
                            updateOrderStatus(order._id, "preparing")
                          }
                          disabled={busy}
                          className="mt-5 w-full bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-200"
                        >
                          👨‍🍳 Mark as preparing
                        </ActionButton>
                      )}

                      {order.status === "preparing" && (
                        <ActionButton
                          onClick={() =>
                            updateOrderStatus(order._id, "delivering")
                          }
                          disabled={busy}
                          className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-200"
                        >
                          🛵 Send out for delivery
                        </ActionButton>
                      )}

                      {order.status === "delivering" && (
                        <ActionButton
                          onClick={() =>
                            updateOrderStatus(order._id, "delivered")
                          }
                          disabled={busy}
                          className="mt-5 w-full bg-emerald-700 hover:bg-emerald-800 focus-visible:ring-emerald-200"
                        >
                          ✅ Mark as delivered
                        </ActionButton>
                      )}

                      {/* Terminal states */}
                      {order.status === "delivered" && (
                        <p className="mt-5 rounded-xl bg-emerald-50 py-2.5 text-center text-sm font-semibold text-emerald-700">
                          ✅ Delivered to customer
                        </p>
                      )}
                      {order.status === "cancelled" && (
                        <p className="mt-5 rounded-xl bg-rose-50 py-2.5 text-center text-sm font-semibold text-rose-600">
                          ❌ Order cancelled
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

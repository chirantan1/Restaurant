import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const CURRENCY = "$";

const STATUS = {
  pending: {
    label: "Pending",
    dot: "bg-[#c48f4a]",
    badge: "text-[#8a5e2e] bg-[#f6ecdd] border-[#e6d3b8]",
  },
  confirmed: {
    label: "Confirmed",
    dot: "bg-[#4a7c9c]",
    badge: "text-[#2e5670] bg-[#e7eff4] border-[#cbdde8]",
  },
  preparing: {
    label: "Preparing",
    dot: "bg-[#7a5e9c]",
    badge: "text-[#4c3968] bg-[#eee8f4] border-[#d8cbe6]",
  },
  delivering: {
    label: "On the way",
    dot: "bg-[#4a5e9c]",
    badge: "text-[#2f3d70] bg-[#e7eaf4] border-[#cbd2e8]",
  },
  delivered: {
    label: "Delivered",
    dot: "bg-[#4a7c4a]",
    badge: "text-[#2d522d] bg-[#ecf3ec] border-[#cfe0cf]",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-[#a03e2e]",
    badge: "text-[#7a2a1f] bg-[#f5ebe8] border-[#e6c8c2]",
  },
};

const STEPS = ["pending", "confirmed", "preparing", "delivering", "delivered"];
const FILTERS = ["all", ...STEPS, "cancelled"];

const inputCls =
  "w-full bg-transparent border-b border-[#d9d2cb] focus:border-[#1e1b1a] outline-none px-0 py-3 text-[#1e1b1a] placeholder:text-[#b8a99c] transition-colors duration-200 focus:ring-0";
const labelCls =
  "block text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[#6b625a] mb-2";

/* ---------- presentational helpers ---------- */

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-[#faf9f7] border border-[#e8e2db] p-5">
      <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[#8b7e72] mb-2">
        {label}
      </p>
      <p className="font-serif text-3xl font-medium leading-none tracking-tight">
        <span className="text-[#8b7e72] text-xl mr-1">{accent}</span>
        {value}
      </p>
    </div>
  );
}

function StatusStepper({ status }) {
  if (status === "cancelled") return null;
  const current = STEPS.indexOf(status);
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Progress: ${STATUS[status]?.label}`}
    >
      {STEPS.map((s, i) => (
        <div key={s} className="flex-1">
          <div
            className={`h-1 transition-colors duration-500 ${
              i <= current ? "bg-[#1e1b1a]" : "bg-[#e8e2db]"
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
      className={`inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-6 py-3 border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {disabled ? "Updating…" : children}
    </button>
  );
}

/* ---------- main component ---------- */

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("restaurants");

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

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersMsg, setOrdersMsg] = useState("");
  const [busyOrderId, setBusyOrderId] = useState(null);
  const [filter, setFilter] = useState("all");

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        {/* ===== HEADER ===== */}
        <header className="border-b border-[#e8e2db] pb-10 mb-10">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            Vendor workspace
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight max-w-2xl">
              Your kitchen,{" "}
              <span className="italic font-normal text-[#8b7e72]">
                in order.
              </span>
            </h1>
            <p className="text-sm text-[#4a423c] font-light leading-relaxed max-w-sm">
              Manage restaurants, track incoming orders, and keep service
              moving.
            </p>
          </div>
        </header>

        {/* ===== STATS ===== */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <StatCard label="Restaurants" value={restaurants.length} accent="—" />
          <StatCard label="Pending orders" value={pendingCount} accent="—" />
          <StatCard
            label="Delivered revenue"
            value={`${CURRENCY}${revenue.toFixed(0)}`}
            accent="—"
          />
        </section>

        {/* ===== TABS ===== */}
        <div role="tablist" className="flex border-b border-[#e8e2db] mb-8">
          {[
            {
              id: "restaurants",
              label: "My Restaurants",
              count: restaurants.length,
            },
            { id: "orders", label: "Incoming Orders", count: orders.length },
          ].map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(t.id)}
                className={`relative px-6 py-4 text-[0.7rem] font-semibold tracking-[0.14em] uppercase transition-colors duration-200 ${
                  active
                    ? "text-[#1e1b1a]"
                    : "text-[#8b7e72] hover:text-[#1e1b1a]"
                }`}
              >
                <span className="flex items-center gap-2">
                  {t.label}
                  <span
                    className={`text-[0.65rem] font-semibold ${
                      active ? "text-[#8b7e72]" : "text-[#b8a99c]"
                    }`}
                  >
                    {t.count}
                  </span>
                </span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-[#1e1b1a]" />
                )}
              </button>
            );
          })}
        </div>

        {/* ============ RESTAURANTS TAB ============ */}
        {activeTab === "restaurants" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
                Your restaurants
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className={`inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-6 py-3 border transition-all duration-200 ${
                  showForm
                    ? "border-[#d9d2cb] text-[#4a423c] hover:border-[#1e1b1a]"
                    : "bg-[#1e1b1a] border-[#1e1b1a] text-[#faf9f7] hover:bg-transparent hover:text-[#1e1b1a]"
                }`}
              >
                {showForm ? "Cancel" : "+ Add restaurant"}
              </button>
            </div>

            {msg && (
              <div
                role="status"
                className={`mb-6 px-4 py-3 text-sm border-l-[3px] flex items-start gap-3 ${
                  msgIsError
                    ? "border-[#b03e2e] bg-[#f5ebe8] text-[#7a2a1f]"
                    : "border-[#4a7c4a] bg-[#ecf3ec] text-[#2d522d]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                    msgIsError ? "bg-[#b03e2e]" : "bg-[#4a7c4a]"
                  }`}
                />
                <span className="leading-relaxed">{msg}</span>
              </div>
            )}

            {showForm && (
              <form
                onSubmit={create}
                className="mb-10 border border-[#e8e2db] bg-white p-6 lg:p-8 space-y-6"
              >
                <div>
                  <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#b8a99c] mb-4">
                    New restaurant
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="title" className={labelCls}>
                      Restaurant name
                    </label>
                    <input
                      id="title"
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
                    <label htmlFor="foodType" className={labelCls}>
                      Food types{" "}
                      <span className="normal-case text-[#b8a99c] font-normal tracking-normal">
                        (comma-separated)
                      </span>
                    </label>
                    <input
                      id="foodType"
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
                  <label htmlFor="image" className={labelCls}>
                    Image URL
                  </label>
                  <input
                    id="image"
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
                    { name: "delivery", label: "Delivery" },
                    { name: "pickup", label: "Pickup" },
                  ].map((opt) => (
                    <label
                      key={opt.name}
                      className={`flex cursor-pointer items-center gap-2 border px-4 py-2.5 text-xs font-medium tracking-[0.1em] uppercase transition ${
                        form[opt.name]
                          ? "border-[#1e1b1a] bg-[#1e1b1a] text-[#faf9f7]"
                          : "border-[#d9d2cb] text-[#4a423c] hover:border-[#1e1b1a]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name={opt.name}
                        checked={form[opt.name]}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          form[opt.name] ? "bg-[#faf9f7]" : "bg-[#b8a99c]"
                        }`}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
                >
                  Create restaurant
                </button>
              </form>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse border border-[#e8e2db] bg-white"
                  >
                    <div className="h-44 bg-[#f0ece7]" />
                    <div className="space-y-3 p-6">
                      <div className="h-4 w-2/3 bg-[#f0ece7]" />
                      <div className="h-3 w-1/2 bg-[#f0ece7]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : restaurants.length === 0 ? (
              <div className="border border-dashed border-[#d9d2cb] px-6 py-20 text-center">
                <p className="font-serif text-2xl tracking-tight mb-2">
                  No restaurants yet
                </p>
                <p className="text-sm text-[#8b7e72] mb-6 font-light">
                  Add your first restaurant to start receiving orders.
                </p>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
                  >
                    + Add restaurant
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {restaurants.map((r) => (
                  <article
                    key={r._id}
                    className="group border border-[#e8e2db] bg-white overflow-hidden hover:shadow-[0_8px_30px_-15px_rgba(0,0,0,0.12)] transition-shadow duration-300"
                  >
                    <div className="relative h-44 overflow-hidden bg-[#f0ece7]">
                      {r.image ? (
                        <img
                          src={r.image}
                          alt={r.title}
                          loading="lazy"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-serif italic text-4xl text-[#b8a99c]">
                          {r.title?.charAt(0) || "R"}
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        {r.delivery && (
                          <span className="bg-white/95 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-[#1e1b1a]">
                            Delivery
                          </span>
                        )}
                        {r.pickup && (
                          <span className="bg-white/95 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-[#1e1b1a]">
                            Pickup
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-serif text-xl tracking-tight mb-3 truncate">
                        {r.title}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {r.foodType?.map((t, i) => (
                          <span
                            key={t + i}
                            className="border border-[#e8e2db] px-2.5 py-1 text-[0.65rem] font-medium tracking-[0.08em] uppercase text-[#6b625a]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/vendor/restaurants/${r._id}`}
                          className="flex-1 inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.12em] uppercase py-3 px-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
                        >
                          Manage menu
                        </Link>
                        <button
                          onClick={() => remove(r._id)}
                          className="inline-flex items-center justify-center text-xs font-medium tracking-[0.12em] uppercase py-3 px-5 border border-[#d9d2cb] text-[#7a2a1f] hover:border-[#b03e2e] hover:bg-[#f5ebe8] transition-all duration-200"
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
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
                Incoming orders
              </h2>
              <button
                onClick={loadOrders}
                disabled={ordersLoading}
                className="inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-5 py-2.5 border border-[#d9d2cb] hover:border-[#1e1b1a] transition-all duration-200 disabled:opacity-40"
              >
                {ordersLoading ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            {/* Filter chips */}
            <div className="-mx-6 mb-8 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 sm:overflow-visible">
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex shrink-0 items-center gap-2 px-4 py-2 text-[0.7rem] font-medium tracking-[0.1em] uppercase border transition-all duration-200 ${
                      active
                        ? "bg-[#1e1b1a] border-[#1e1b1a] text-[#faf9f7]"
                        : "bg-transparent border-[#d9d2cb] text-[#4a423c] hover:border-[#1e1b1a]"
                    }`}
                  >
                    {f !== "all" && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${STATUS[f].dot}`}
                      />
                    )}
                    {f === "all" ? "All" : STATUS[f].label}
                    <span
                      className={
                        active ? "text-[#faf9f7]/60" : "text-[#b8a99c]"
                      }
                    >
                      {counts[f] || 0}
                    </span>
                  </button>
                );
              })}
            </div>

            {ordersMsg && (
              <div
                role="alert"
                className="mb-6 border-l-[3px] border-[#b03e2e] bg-[#f5ebe8] px-4 py-3 text-sm text-[#7a2a1f] flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#b03e2e] mt-2 shrink-0" />
                <span className="leading-relaxed">{ordersMsg}</span>
              </div>
            )}

            {ordersLoading && orders.length === 0 ? (
              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse border border-[#e8e2db] bg-white p-6 space-y-3"
                  >
                    <div className="h-4 w-1/3 bg-[#f0ece7]" />
                    <div className="h-3 w-1/2 bg-[#f0ece7]" />
                    <div className="h-3 w-2/3 bg-[#f0ece7]" />
                  </div>
                ))}
              </div>
            ) : visibleOrders.length === 0 ? (
              <div className="border border-dashed border-[#d9d2cb] px-6 py-20 text-center">
                <p className="font-serif text-2xl tracking-tight mb-2">
                  {orders.length === 0
                    ? "No orders yet"
                    : "No orders in this filter"}
                </p>
                <p className="text-sm text-[#8b7e72] font-light">
                  {orders.length === 0
                    ? "New customer orders will show up here."
                    : "Pick another status above to see more orders."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {visibleOrders.map((order) => {
                  const st = STATUS[order.status] || STATUS.pending;
                  const busy = busyOrderId === order._id;
                  return (
                    <article
                      key={order._id}
                      className="border border-[#e8e2db] bg-white"
                    >
                      <div className={`h-1 ${st.dot}`} />

                      <div className="p-6 lg:p-8">
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                          <div className="min-w-0">
                            <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[#8b7e72] mb-1">
                              Order #{order._id.slice(-6)}
                            </p>
                            <h3 className="font-serif text-xl tracking-tight truncate">
                              {order.restaurant?.title || "Unknown"}
                            </h3>
                          </div>
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.1em] uppercase border ${st.badge}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                            />
                            {st.label}
                          </span>
                        </div>

                        {/* Customer */}
                        <div className="grid gap-3 sm:grid-cols-2 bg-[#f5f1ec] px-5 py-4 text-sm mb-6">
                          <div>
                            <p className="text-[0.6rem] font-semibold tracking-[0.14em] uppercase text-[#8b7e72] mb-1">
                              Customer
                            </p>
                            <p className="text-[#1e1b1a] font-medium truncate">
                              {order.buyer?.username || "Unknown"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[0.6rem] font-semibold tracking-[0.14em] uppercase text-[#8b7e72] mb-1">
                              Phone
                            </p>
                            <p className="text-[#1e1b1a] font-medium">
                              {order.phone}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-[0.6rem] font-semibold tracking-[0.14em] uppercase text-[#8b7e72] mb-1">
                              Delivery address
                            </p>
                            <p className="text-[#1e1b1a] font-medium">
                              {order.deliveryAddress}
                            </p>
                          </div>
                        </div>

                        <StatusStepper status={order.status} />

                        {/* Items */}
                        <div className="mt-6">
                          <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[#8b7e72] mb-3">
                            Items
                          </p>
                          <ul className="divide-y divide-[#e8e2db] text-sm">
                            {order.items?.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-center justify-between gap-3 py-3"
                              >
                                <span className="flex min-w-0 items-center gap-3">
                                  <span className="border border-[#d9d2cb] px-2 py-0.5 text-[0.65rem] font-semibold text-[#4a423c]">
                                    {item.quantity}&times;
                                  </span>
                                  <span className="truncate text-[#1e1b1a]">
                                    {item.food?.title || "Item"}
                                  </span>
                                </span>
                                <span className="font-medium text-[#4a423c]">
                                  {CURRENCY}
                                  {item.price}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4 flex items-center justify-between border-t border-[#e8e2db] pt-4">
                            <span className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[#6b625a]">
                              Total
                            </span>
                            <span className="font-serif text-2xl font-medium tracking-tight">
                              {CURRENCY}
                              {order.totalAmount}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        {order.status === "pending" && (
                          <div className="mt-6 grid grid-cols-2 gap-3">
                            <ActionButton
                              onClick={() =>
                                updateOrderStatus(order._id, "confirmed")
                              }
                              disabled={busy}
                              className="border-[#1e1b1a] bg-[#1e1b1a] text-[#faf9f7] hover:bg-transparent hover:text-[#1e1b1a]"
                            >
                              Accept
                            </ActionButton>
                            <ActionButton
                              onClick={() =>
                                updateOrderStatus(order._id, "cancelled")
                              }
                              disabled={busy}
                              className="border-[#d9d2cb] text-[#7a2a1f] hover:border-[#b03e2e] hover:bg-[#f5ebe8]"
                            >
                              Reject
                            </ActionButton>
                          </div>
                        )}

                        {order.status === "confirmed" && (
                          <ActionButton
                            onClick={() =>
                              updateOrderStatus(order._id, "preparing")
                            }
                            disabled={busy}
                            className="mt-6 w-full border-[#1e1b1a] bg-[#1e1b1a] text-[#faf9f7] hover:bg-transparent hover:text-[#1e1b1a]"
                          >
                            Mark as preparing
                          </ActionButton>
                        )}

                        {order.status === "preparing" && (
                          <ActionButton
                            onClick={() =>
                              updateOrderStatus(order._id, "delivering")
                            }
                            disabled={busy}
                            className="mt-6 w-full border-[#1e1b1a] bg-[#1e1b1a] text-[#faf9f7] hover:bg-transparent hover:text-[#1e1b1a]"
                          >
                            Send out for delivery
                          </ActionButton>
                        )}

                        {order.status === "delivering" && (
                          <ActionButton
                            onClick={() =>
                              updateOrderStatus(order._id, "delivered")
                            }
                            disabled={busy}
                            className="mt-6 w-full border-[#1e1b1a] bg-[#1e1b1a] text-[#faf9f7] hover:bg-transparent hover:text-[#1e1b1a]"
                          >
                            Mark as delivered
                          </ActionButton>
                        )}

                        {order.status === "delivered" && (
                          <p className="mt-6 border-l-[3px] border-[#4a7c4a] bg-[#ecf3ec] py-3 px-4 text-xs font-medium tracking-[0.1em] uppercase text-[#2d522d]">
                            Delivered to customer
                          </p>
                        )}
                        {order.status === "cancelled" && (
                          <p className="mt-6 border-l-[3px] border-[#b03e2e] bg-[#f5ebe8] py-3 px-4 text-xs font-medium tracking-[0.1em] uppercase text-[#7a2a1f]">
                            Order cancelled
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
    </div>
  );
}

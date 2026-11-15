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

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

function StatusStepper({ status }) {
  if (status === "cancelled") return null;
  const current = STEPS.indexOf(status);
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Progress: ${STATUS[status]?.label}`}
    >
      {STEPS.map((s, i) => (
        <div key={s} className="flex-1">
          <div
            className={`h-0.5 transition-colors duration-500 ${
              i <= current ? "bg-[#1e1b1a]" : "bg-[#e8e2db]"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

function SkeletonOrder() {
  return (
    <div className="border border-[#e8e2db] bg-white p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-[#f0ece7]" />
          <div className="h-3 w-24 bg-[#f0ece7]" />
        </div>
        <div className="h-6 w-20 bg-[#f0ece7]" />
      </div>
      <div className="h-3 w-full bg-[#f0ece7] mb-2" />
      <div className="h-3 w-2/3 bg-[#f0ece7]" />
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancelError, setCancelError] = useState("");

  const load = () => {
    api
      .get("/order/getMyOrders")
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    if (!confirm("Cancel this order?")) return;
    setCancelError("");
    try {
      await api.put(`/order/cancel/${id}`);
      load();
    } catch (err) {
      setCancelError(err.response?.data?.message || "Cancel failed");
    }
  };

  const counts = useMemo(() => {
    const c = { all: orders.length, active: 0, delivered: 0, cancelled: 0 };
    orders.forEach((o) => {
      if (o.status === "delivered") c.delivered += 1;
      else if (o.status === "cancelled") c.cancelled += 1;
      else c.active += 1;
    });
    return c;
  }, [orders]);

  const visible = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "delivered")
      return orders.filter((o) => o.status === "delivered");
    if (filter === "cancelled")
      return orders.filter((o) => o.status === "cancelled");
    return orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  }, [orders, filter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
          <div className="border-b border-[#e8e2db] pb-10 mb-10">
            <div className="h-3 w-20 bg-[#f0ece7] animate-pulse mb-4" />
            <div className="h-12 w-1/2 bg-[#f0ece7] animate-pulse" />
          </div>
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <SkeletonOrder key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        {/* Header */}
        <header className="border-b border-[#e8e2db] pb-10 mb-8">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            History
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
              My orders
            </h1>
            <p className="text-sm text-[#4a423c] font-light leading-relaxed max-w-sm">
              Track live orders and revisit past meals.
            </p>
          </div>
        </header>

        {/* Filters */}
        {orders.length > 0 && (
          <div className="flex gap-2 mb-8 flex-wrap">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-[0.7rem] font-semibold tracking-[0.12em] uppercase border transition-all duration-200 ${
                    active
                      ? "bg-[#1e1b1a] border-[#1e1b1a] text-[#faf9f7]"
                      : "border-[#d9d2cb] text-[#4a423c] hover:border-[#1e1b1a]"
                  }`}
                >
                  {f.label}
                  <span
                    className={active ? "text-[#faf9f7]/60" : "text-[#b8a99c]"}
                  >
                    {counts[f.id] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Cancel error */}
        {cancelError && (
          <div
            role="alert"
            className="mb-6 border-l-[3px] border-[#b03e2e] bg-[#f5ebe8] px-4 py-3 text-sm text-[#7a2a1f] flex items-start gap-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#b03e2e] mt-2 shrink-0" />
            <span className="leading-relaxed">{cancelError}</span>
          </div>
        )}

        {/* Empty states */}
        {orders.length === 0 ? (
          <div className="border border-dashed border-[#d9d2cb] px-6 py-20 text-center">
            <p className="font-serif text-2xl tracking-tight mb-2">
              No orders yet
            </p>
            <p className="text-sm text-[#8b7e72] font-light mb-6">
              Your order history will appear here.
            </p>
            <Link
              to="/restaurants"
              className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
            >
              Browse restaurants
            </Link>
          </div>
        ) : visible.length === 0 ? (
          <div className="border border-dashed border-[#d9d2cb] px-6 py-16 text-center">
            <p className="font-serif text-xl tracking-tight mb-2">
              Nothing in this view
            </p>
            <p className="text-sm text-[#8b7e72] font-light mb-6">
              Try another filter above.
            </p>
            <button
              onClick={() => setFilter("all")}
              className="inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-6 py-3 border border-[#d9d2cb] hover:border-[#1e1b1a] transition-all duration-200"
            >
              Show all orders
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((o) => {
              const st = STATUS[o.status] || STATUS.pending;
              const canCancel = !["delivered", "cancelled"].includes(o.status);

              return (
                <article
                  key={o._id}
                  className="border border-[#e8e2db] bg-white hover:shadow-[0_8px_30px_-15px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                >
                  <div className={`h-1 ${st.dot}`} />
                  <div className="p-6">
                    {/* Header row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[#8b7e72] mb-1">
                          Order #{o._id.slice(-6)}
                        </p>
                        <Link
                          to={`/restaurants/${o.restaurant?._id || ""}`}
                          className="font-serif text-xl tracking-tight truncate hover:text-[#8b7e72] transition-colors"
                        >
                          {o.restaurant?.title || "Restaurant"}
                        </Link>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif text-xl font-medium tracking-tight tabular-nums">
                          {CURRENCY}
                          {(Number(o.totalAmount) || 0).toFixed(2)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.1em] uppercase border ${st.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                          />
                          {st.label}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    {o.status !== "cancelled" && (
                      <div className="mb-5">
                        <StatusStepper status={o.status} />
                      </div>
                    )}

                    {/* Items */}
                    {o.items?.length > 0 && (
                      <div className="border-t border-[#e8e2db] pt-4">
                        <p className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-[#8b7e72] mb-3">
                          Items
                        </p>
                        <ul className="space-y-2 text-sm">
                          {o.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between gap-3"
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                <span className="border border-[#d9d2cb] px-2 py-0.5 text-[0.65rem] font-semibold text-[#4a423c] tabular-nums">
                                  {item.quantity}&times;
                                </span>
                                <span className="truncate text-[#1e1b1a]">
                                  {item.food?.title || "Food"}
                                </span>
                              </span>
                              <span className="text-[#6b625a] tabular-nums">
                                {CURRENCY}
                                {item.price}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cancel */}
                    {canCancel && (
                      <div className="mt-5 pt-4 border-t border-[#e8e2db] flex justify-end">
                        <button
                          onClick={() => cancel(o._id)}
                          className="inline-flex items-center justify-center text-[0.65rem] font-semibold tracking-[0.14em] uppercase px-5 py-2.5 border border-[#d9d2cb] text-[#7a2a1f] hover:border-[#b03e2e] hover:bg-[#f5ebe8] transition-all duration-200"
                        >
                          Cancel order
                        </button>
                      </div>
                    )}

                    {/* Terminal state notes */}
                    {o.status === "delivered" && (
                      <div className="mt-5 pt-4 border-t border-[#e8e2db]">
                        <p className="border-l-[3px] border-[#4a7c4a] bg-[#ecf3ec] py-2.5 px-4 text-xs font-medium tracking-[0.1em] uppercase text-[#2d522d]">
                          Delivered
                        </p>
                      </div>
                    )}
                    {o.status === "cancelled" && (
                      <div className="mt-5 pt-4 border-t border-[#e8e2db]">
                        <p className="border-l-[3px] border-[#b03e2e] bg-[#f5ebe8] py-2.5 px-4 text-xs font-medium tracking-[0.1em] uppercase text-[#7a2a1f]">
                          Order cancelled
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    try {
      await api.put(`/order/cancel/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {o.restaurant?.title || "Restaurant"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Order #{o._id.slice(-6)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-500">
                    ${(o.totalAmount || 0).toFixed(2)}
                  </p>
                  <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                    {o.status}
                  </span>
                </div>
              </div>
              <ul className="mt-3 text-sm">
                {o.items?.map((item, i) => (
                  <li key={i}>
                    {item.food?.title || "Food"} × {item.quantity} — $
                    {item.price}
                  </li>
                ))}
              </ul>
              {!["delivered", "cancelled"].includes(o.status) && (
                <button
                  onClick={() => cancel(o._id)}
                  className="btn-danger mt-3 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

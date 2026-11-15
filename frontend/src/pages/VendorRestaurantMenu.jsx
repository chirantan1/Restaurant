/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const CURRENCY = "$"; // change to "₹" if you want rupees

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

const chipColors = [
  "bg-orange-100 text-orange-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-pink-100 text-pink-700",
];

export default function VendorRestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [loadError, setLoadError] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  const load = async () => {
    try {
      const [r, f] = await Promise.all([
        api.get(`/restaurant/getbyid/${id}`),
        api.get(`/food/getByRestaurant/${id}`),
      ]);
      setRestaurant(r.data.restaurant);
      setFoods(f.data.foods || []);
      setLoadError(false);
    } catch (err) {
      setLoadError(true);
      setMsg(err.response?.data?.message || "Failed to load");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await load();
    };

    fetchData();
  }, [id]);

  const createFood = async (e) => {
    e.preventDefault();
    try {
      await api.post("/food/create", {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        image: form.image,
        restaurant: id,
      });
      setMsg("Food created");
      setForm({ title: "", description: "", price: "", image: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to create food");
    }
  };

  const deleteFood = async (foodId) => {
    if (!window.confirm("Delete this food?")) return;
    try {
      await api.delete(`/food/delete/${foodId}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const msgIsError = /fail|error/i.test(msg);

  /* ---------- loading / error state ---------- */
  if (!restaurant) {
    if (loadError) {
      return (
        <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6">
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
            <div className="text-5xl">⚠️</div>
            <p className="mt-3 text-lg font-bold text-slate-800">
              {msg || "Failed to load"}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={load}
                className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110"
              >
                Try again
              </button>
              <button
                onClick={() => navigate("/vendor")}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200 hover:bg-slate-50"
              >
                Back to restaurants
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="mx-auto max-w-4xl animate-pulse space-y-5 px-3 py-6 sm:px-6">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="h-56 rounded-3xl bg-slate-200" />
        <div className="h-24 rounded-3xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
      {/* Back link */}
      <button
        onClick={() => navigate("/vendor")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200 transition hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
      >
        ← Back to restaurants
      </button>

      {/* ===== Restaurant hero ===== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 shadow-xl">
        {restaurant.image && (
          <img
            src={restaurant.image}
            alt={restaurant.title}
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="relative flex min-h-[13rem] flex-col justify-end p-5 sm:min-h-[16rem] sm:p-8">
          <div className="mb-3 flex flex-wrap gap-2">
            {restaurant.delivery && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-emerald-700 shadow">
                🛵 Delivery
              </span>
            )}
            {restaurant.pickup && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-sky-700 shadow">
                🛍️ Pickup
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
            {restaurant.title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {restaurant.foodType?.map((t, i) => (
              <span
                key={t + i}
                className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Menu header ===== */}
      <div className="mb-5 mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">Menu</h2>
          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
            {foods.length} {foods.length === 1 ? "item" : "items"}
          </span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 ${
            showForm
              ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
              : "bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:brightness-110"
          }`}
        >
          {showForm ? "Cancel" : "+ Add food"}
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

      {/* ===== Add food form ===== */}
      {showForm && (
        <form
          onSubmit={createFood}
          className="mb-8 space-y-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-lg sm:p-7"
        >
          <h3 className="text-lg font-bold text-slate-800">New food item</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Title
              </label>
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Margherita pizza"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Price ({CURRENCY})
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={inputCls}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="9.99"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Description
            </label>
            <input
              className={inputCls}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Fresh basil, mozzarella and tomato sauce"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Image URL
            </label>
            <input
              className={inputCls}
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://picsum.photos/seed/food/400/400"
            />
          </div>

          <button className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200">
            Create food
          </button>
        </form>
      )}

      {/* ===== Food list ===== */}
      {foods.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/50 px-6 py-14 text-center">
          <div className="text-5xl">🍔</div>
          <p className="mt-3 text-lg font-bold text-slate-800">
            No food items yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add your first dish so customers can order it.
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110"
            >
              + Add food
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {foods.map((f, i) => (
            <article
              key={f._id}
              className="group flex gap-4 rounded-3xl bg-white p-3 shadow-md ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-xl sm:p-4"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-orange-200 via-rose-200 to-fuchsia-200 sm:h-28 sm:w-28">
                {f.image ? (
                  <img
                    src={f.image}
                    alt={f.title}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl">
                    🍽️
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="truncate font-bold text-slate-800">{f.title}</h3>
                <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
                  {f.description}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-extrabold ${chipColors[i % chipColors.length]}`}
                  >
                    {CURRENCY}
                    {f.price}
                  </span>
                  <button
                    onClick={() => deleteFood(f._id)}
                    className="rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 sm:text-sm"
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
  );
}

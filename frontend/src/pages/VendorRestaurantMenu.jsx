/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";

const CURRENCY = "$";

const inputCls =
  "w-full bg-transparent border-b border-[#d9d2cb] focus:border-[#1e1b1a] outline-none px-0 py-3 text-[#1e1b1a] placeholder:text-[#b8a99c] transition-colors duration-200 focus:ring-0";
const labelCls =
  "block text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[#6b625a] mb-2";

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="h-3 w-32 bg-[#f0ece7] animate-pulse mb-4" />
        <div className="h-64 w-full bg-[#f0ece7] animate-pulse mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-[#f0ece7] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VendorRestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyFoodId, setBusyFoodId] = useState(null);

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
      setMsg("");
    } catch (err) {
      setLoadError(true);
      setMsg(err.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
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
      await load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to create food");
    }
  };

  const deleteFood = async (foodId) => {
    if (!window.confirm("Delete this food?")) return;
    if (busyFoodId) return;
    try {
      setBusyFoodId(foodId);
      await api.delete(`/food/delete/${foodId}`);
      await load();
    } catch (err) {
      setMsg(err.response?.data?.message || "Delete failed");
    } finally {
      setBusyFoodId(null);
    }
  };

  const msgIsError = /fail|error/i.test(msg);

  /* ---------- error ---------- */
  if (!restaurant && loadError) {
    return (
      <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="max-w-xl border-l-[3px] border-[#b03e2e] bg-[#f5ebe8] px-6 py-8">
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#a03e2e] mb-3">
              Something went wrong
            </p>
            <h2 className="font-serif text-3xl tracking-tight mb-3">
              We couldn't load this menu.
            </h2>
            <p className="text-sm text-[#7a2a1f] font-light leading-relaxed mb-6">
              {msg || "Failed to load"}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={load}
                className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-6 py-3 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
              >
                Try again
              </button>
              <button
                onClick={() => navigate("/vendor")}
                className="inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-6 py-3 border border-[#d9d2cb] text-[#4a423c] hover:border-[#1e1b1a] transition-all duration-200"
              >
                Back to restaurants
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- loading ---------- */
  if (loading || !restaurant) return <Skeleton />;

  /* ---------- main ---------- */
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
        {/* Back */}
        <nav className="mb-6 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#8b7e72]">
          <Link to="/vendor" className="hover:text-[#1e1b1a] transition-colors">
            Vendor
          </Link>
          <span className="mx-2 text-[#b8a99c]">/</span>
          <span className="text-[#1e1b1a] truncate">{restaurant.title}</span>
        </nav>

        {/* ===== HERO ===== */}
        <section className="relative h-56 lg:h-72 overflow-hidden bg-[#f0ece7] mb-10">
          {restaurant.image && (
            <img
              src={restaurant.image}
              alt={restaurant.title}
              onError={(e) => (e.currentTarget.style.opacity = "0")}
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b1a]/80 via-[#1e1b1a]/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {restaurant.delivery && (
                <span className="bg-white/95 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-[#1e1b1a]">
                  Delivery
                </span>
              )}
              {restaurant.pickup && (
                <span className="bg-white/95 px-3 py-1 text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-[#1e1b1a]">
                  Pickup
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl leading-[1.05] tracking-tight text-[#faf9f7] mb-2">
              {restaurant.title}
            </h1>
            {restaurant.foodType?.length > 0 && (
              <p className="text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#faf9f7]/70">
                {restaurant.foodType.join(" · ")}
              </p>
            )}
          </div>
        </section>

        {/* ===== MENU HEADER ===== */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8 pb-6 border-b border-[#e8e2db]">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
              Menu
            </h2>
            <p className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-[#8b7e72] mt-2">
              {foods.length} {foods.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-6 py-3 border transition-all duration-200 ${
              showForm
                ? "border-[#d9d2cb] text-[#4a423c] hover:border-[#1e1b1a]"
                : "bg-[#1e1b1a] border-[#1e1b1a] text-[#faf9f7] hover:bg-transparent hover:text-[#1e1b1a]"
            }`}
          >
            {showForm ? "Cancel" : "+ Add food"}
          </button>
        </div>

        {/* Alerts */}
        {msg && (
          <div
            role="status"
            className={`mb-6 border-l-[3px] px-4 py-3 text-sm flex items-start gap-3 ${
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

        {/* ===== FORM ===== */}
        {showForm && (
          <form
            onSubmit={createFood}
            className="mb-10 border border-[#e8e2db] bg-white p-6 lg:p-8 space-y-6"
          >
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#b8a99c]">
              New food item
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className={labelCls}>
                  Title
                </label>
                <input
                  id="title"
                  className={inputCls}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Margherita pizza"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className={labelCls}>
                  Price ({CURRENCY})
                </label>
                <input
                  id="price"
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
              <label htmlFor="description" className={labelCls}>
                Description
              </label>
              <input
                id="description"
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
              <label htmlFor="image" className={labelCls}>
                Image URL
              </label>
              <input
                id="image"
                type="url"
                className={inputCls}
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://picsum.photos/seed/food/400/400"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
            >
              Create food
            </button>
          </form>
        )}

        {/* ===== FOOD LIST ===== */}
        {foods.length === 0 ? (
          <div className="border border-dashed border-[#d9d2cb] px-6 py-20 text-center">
            <p className="font-serif text-2xl tracking-tight mb-2">
              No food items yet
            </p>
            <p className="text-sm text-[#8b7e72] font-light mb-6">
              Add your first dish so customers can order it.
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-8 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
              >
                + Add food
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foods.map((f) => {
              const busy = busyFoodId === f._id;
              return (
                <article
                  key={f._id}
                  className={`group flex gap-4 border border-[#e8e2db] bg-white p-4 hover:shadow-[0_8px_30px_-15px_rgba(0,0,0,0.08)] transition-shadow duration-300 ${
                    busy ? "opacity-50" : ""
                  }`}
                >
                  <div className="w-24 h-24 shrink-0 overflow-hidden bg-[#f0ece7]">
                    {f.image ? (
                      <img
                        src={f.image}
                        alt={f.title}
                        loading="lazy"
                        onError={(e) => (e.currentTarget.style.opacity = "0")}
                        className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-serif italic text-2xl text-[#b8a99c]">
                        {f.title?.charAt(0) || "F"}
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="font-serif text-lg tracking-tight truncate">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#6b625a] font-light leading-snug line-clamp-2">
                      {f.description}
                    </p>
                    <div className="mt-auto pt-3 flex items-center justify-between gap-3">
                      <span className="font-serif text-lg font-medium tabular-nums">
                        {CURRENCY}
                        {f.price}
                      </span>
                      <button
                        onClick={() => deleteFood(f._id)}
                        disabled={busy}
                        className="inline-flex items-center justify-center text-[0.6rem] font-semibold tracking-[0.14em] uppercase px-3 py-1.5 border border-[#d9d2cb] text-[#7a2a1f] hover:border-[#b03e2e] hover:bg-[#f5ebe8] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {busy ? "…" : "Delete"}
                      </button>
                    </div>
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

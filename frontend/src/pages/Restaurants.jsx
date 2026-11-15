/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

/* ---------- helpers ---------- */

function RatingBadge({ rating, count }) {
  const value = Number(rating) || 0;
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#6b625a]">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          value >= 4
            ? "bg-[#4a7c4a]"
            : value >= 3
              ? "bg-[#c48f4a]"
              : "bg-[#b8a99c]"
        }`}
      />
      {value.toFixed(1)}
      <span className="text-[#b8a99c] font-normal tracking-normal normal-case">
        ({count || 0})
      </span>
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="border border-[#e8e2db] bg-white animate-pulse">
      <div className="h-40 bg-[#f0ece7]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-2/3 bg-[#f0ece7]" />
        <div className="h-3 w-1/2 bg-[#f0ece7]" />
        <div className="h-3 w-1/3 bg-[#f0ece7]" />
      </div>
    </div>
  );
}

/* ---------- main component ---------- */

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("all"); // "all" | "delivery" | "pickup"

  const fetchRestaurants = async () => {
    try {
      const response = await api.get("/restaurant/getall");
      console.log("Restaurant API response:", response.data);

      const restaurantData = response.data?.restaurants;
      if (!Array.isArray(restaurantData)) {
        throw new Error(
          response.data?.message || "Invalid response from restaurant server",
        );
      }
      setRestaurants(restaurantData);
    } catch (err) {
      console.error("Restaurant API error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load restaurants",
      );
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRestaurants();
  }, []);

  const retry = () => {
    setLoading(true);
    setError("");
    void fetchRestaurants();
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter((r) => {
      if (mode === "delivery" && !r.delivery) return false;
      if (mode === "pickup" && !r.pickup) return false;
      if (!q) return true;
      const titleMatch = (r.title || "").toLowerCase().includes(q);
      const types = Array.isArray(r.foodType) ? r.foodType : [r.foodType || ""];
      const typeMatch = types.some((t) => String(t).toLowerCase().includes(q));
      return titleMatch || typeMatch;
    });
  }, [restaurants, query, mode]);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
          <div className="border-b border-[#e8e2db] pb-10 mb-10">
            <div className="h-3 w-24 bg-[#f0ece7] animate-pulse mb-4" />
            <div className="h-12 w-2/3 bg-[#f0ece7] animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- ERROR ---------- */
  if (error) {
    return (
      <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-24">
          <div className="max-w-xl border-l-[3px] border-[#b03e2e] bg-[#f5ebe8] px-6 py-8">
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#a03e2e] mb-3">
              Something went wrong
            </p>
            <h2 className="font-serif text-3xl tracking-tight mb-3">
              We couldn't load restaurants.
            </h2>
            <p className="text-sm text-[#7a2a1f] font-light leading-relaxed mb-6">
              {error}
            </p>
            <button
              onClick={retry}
              className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-6 py-3 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- MAIN ---------- */
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        {/* Header */}
        <header className="border-b border-[#e8e2db] pb-10 mb-10">
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#8b7e72] mb-4">
            Browse
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight">
                Restaurants{" "}
                <span className="italic font-normal text-[#8b7e72]">
                  near you.
                </span>
              </h1>
              <p className="text-sm text-[#4a423c] font-light leading-relaxed mt-3 max-w-md">
                {restaurants.length} curated kitchens, vetted for quality and
                craft.
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or cuisine"
                className="w-full sm:w-64 bg-transparent border-b border-[#d9d2cb] focus:border-[#1e1b1a] outline-none px-0 py-2 text-sm placeholder:text-[#b8a99c] transition-colors duration-200 focus:ring-0"
              />
              <div className="flex border border-[#d9d2cb]">
                {[
                  { id: "all", label: "All" },
                  { id: "delivery", label: "Delivery" },
                  { id: "pickup", label: "Pickup" },
                ].map((m) => {
                  const active = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`px-4 py-2 text-[0.65rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-200 ${
                        active
                          ? "bg-[#1e1b1a] text-[#faf9f7]"
                          : "text-[#4a423c] hover:bg-[#1e1b1a]/[0.03]"
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Empty state */}
        {restaurants.length === 0 ? (
          <div className="border border-dashed border-[#d9d2cb] px-6 py-20 text-center">
            <p className="font-serif text-2xl tracking-tight mb-2">
              No restaurants available
            </p>
            <p className="text-sm text-[#8b7e72] font-light">
              Restaurants will appear here when they are added.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="border border-dashed border-[#d9d2cb] px-6 py-20 text-center">
            <p className="font-serif text-2xl tracking-tight mb-2">
              No matches for your search
            </p>
            <p className="text-sm text-[#8b7e72] font-light mb-6">
              Try a different name, cuisine, or service type.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setMode("all");
              }}
              className="inline-flex items-center justify-center text-xs font-medium tracking-[0.14em] uppercase px-6 py-3 border border-[#d9d2cb] hover:border-[#1e1b1a] transition-all duration-200"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {visible.map((restaurant) => {
              const types = Array.isArray(restaurant.foodType)
                ? restaurant.foodType
                : restaurant.foodType
                  ? [restaurant.foodType]
                  : [];

              return (
                <Link
                  to={`/restaurants/${restaurant._id}`}
                  key={restaurant._id}
                  className="group block border border-[#e8e2db] bg-white overflow-hidden hover:shadow-[0_8px_30px_-15px_rgba(0,0,0,0.12)] transition-shadow duration-300"
                >
                  <div className="relative h-40 overflow-hidden bg-[#f0ece7]">
                    <img
                      src={restaurant.image || "/placeholder.png"}
                      alt={restaurant.title || "Restaurant"}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {restaurant.delivery && (
                        <span className="bg-white/95 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-[#1e1b1a]">
                          Delivery
                        </span>
                      )}
                      {restaurant.pickup && (
                        <span className="bg-white/95 px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.1em] uppercase text-[#1e1b1a]">
                          Pickup
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-serif text-lg tracking-tight truncate">
                        {restaurant.title}
                      </h3>
                      <RatingBadge
                        rating={restaurant.rating}
                        count={restaurant.ratingcount}
                      />
                    </div>

                    {types.length > 0 && (
                      <p className="text-[0.7rem] font-medium tracking-[0.08em] uppercase text-[#8b7e72] truncate">
                        {types.join(" · ")}
                      </p>
                    )}

                    <div className="mt-5 pt-4 border-t border-[#e8e2db] flex items-center justify-between">
                      <span className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-[#b8a99c]">
                        View menu
                      </span>
                      <span className="text-[#1e1b1a] group-hover:translate-x-1 transition-transform duration-300">
                        &#8594;
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

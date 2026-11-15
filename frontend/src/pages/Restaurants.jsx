import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/restaurant/getall")
      .then((res) => setRestaurants(res.data.restaurants || res.data || []))
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
      {restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <Link
              to={`/restaurants/${r._id}`}
              key={r._id}
              className="card hover:shadow-md transition"
            >
              <img
                src={r.image}
                alt={r.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold text-lg">{r.title}</h3>
              <p className="text-sm text-gray-500">{r.foodType?.join(", ")}</p>
              <p className="text-sm mt-2">
                ⭐ {r.rating || 0} ({r.ratingcount || 0})
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

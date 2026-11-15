/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRestaurants = async () => {
    try {
      const response = await api.get("/restaurant/getall");

      console.log("Restaurant API response:", response.data);

      // Extract the restaurant array safely.
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-lg">Loading restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-xl font-bold text-red-500">
          Failed to load restaurants
        </h2>

        <p className="text-gray-500 mt-2">{error}</p>

        <button
          onClick={() => {
            setLoading(true);
            setError("");
            void fetchRestaurants();
          }}
          className="mt-5 px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurants</h1>

      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">No restaurants available</h2>
          <p className="text-gray-500 mt-2">
            Restaurants will appear here when they are added.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              to={`/restaurants/${restaurant._id}`}
              key={restaurant._id}
              className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4"
            >
              <img
                src={restaurant.image || "/placeholder.png"}
                alt={restaurant.title || "Restaurant"}
                className="w-full h-40 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />

              <h3 className="font-semibold text-lg">{restaurant.title}</h3>

              <p className="text-sm text-gray-500 mt-1">
                {Array.isArray(restaurant.foodType)
                  ? restaurant.foodType.join(", ")
                  : restaurant.foodType || ""}
              </p>

              <p className="text-sm mt-2">
                ⭐ {restaurant.rating || 0} ({restaurant.ratingcount || 0})
              </p>

              <p className="text-sm mt-2">
                {restaurant.delivery && "Delivery"}
                {restaurant.delivery && restaurant.pickup && " · "}
                {restaurant.pickup && "Pickup"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

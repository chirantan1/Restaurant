import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function RestaurantDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    api
      .get(`/restaurant/getbyid/${id}`)
      .then((res) => setRestaurant(res.data.restaurant || res.data))
      .catch(() => {});
    api
      .get(`/food/getByRestaurant/${id}`)
      .then((res) => setFoods(res.data.foods || []))
      .catch(() => setFoods([]));
  }, [id]);

  const addToCart = (food) => {
    setCart((c) => {
      const existing = c.find((i) => i.food === food._id);
      if (existing) {
        return c.map((i) =>
          i.food === food._id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...c,
        { food: food._id, title: food.title, price: food.price, quantity: 1 },
      ];
    });
  };

  const removeFromCart = (foodId) =>
    setCart((c) => c.filter((i) => i.food !== foodId));

  const placeOrder = async () => {
    if (!user) return navigate("/login");
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      await api.post("/order/create", {
        restaurant: id,
        items: cart.map(({ food, quantity }) => ({ food, quantity })),
        deliveryAddress: user.address?.[0] || "Default address",
        phone: user.phoneNumber,
        paymentMethod: "cash",
      });
      navigate("/my-orders");
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setPlacing(false);
    }
  };

  if (!restaurant) return <p>Loading...</p>;

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div>
      <div className="card mb-6">
        <img
          src={restaurant.image}
          alt={restaurant.title}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />
        <h1 className="text-3xl font-bold">{restaurant.title}</h1>
        <p className="text-gray-500">{restaurant.foodType?.join(", ")}</p>
        <p>
          ⭐ {restaurant.rating} ({restaurant.ratingcount} reviews)
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Menu</h2>
      {foods.length === 0 ? (
        <p className="text-gray-500">No food items yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foods.map((f) => (
            <div key={f._id} className="card flex gap-4">
              <img
                src={f.image}
                alt={f.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
                <p className="font-bold text-red-500 mt-2">${f.price}</p>
              </div>
              <button
                onClick={() => addToCart(f)}
                className="btn-primary self-center"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="card mt-6 sticky bottom-4">
          <h3 className="font-bold mb-2">
            Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)
          </h3>
          <ul className="text-sm space-y-1 mb-3">
            {cart.map((i) => (
              <li key={i.food} className="flex justify-between">
                <span>
                  {i.title} × {i.quantity}
                </span>
                <span className="flex gap-2 items-center">
                  ${(i.price * i.quantity).toFixed(2)}
                  <button
                    onClick={() => removeFromCart(i.food)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <p className="font-bold mb-2">Total: ${total.toFixed(2)}</p>
          <button
            onClick={placeOrder}
            disabled={placing}
            className="btn-primary w-full"
          >
            {placing ? "Placing..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}

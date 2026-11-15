import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";

const CURRENCY = "$";

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="h-3 w-24 bg-[#f0ece7] animate-pulse mb-4" />
        <div className="h-64 w-full bg-[#f0ece7] animate-pulse mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 bg-[#f0ece7] animate-pulse" />
            ))}
          </div>
          <div className="h-80 bg-[#f0ece7] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [error] = useState("");
  const [orderError, setOrderError] = useState("");

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

  const updateQuantity = (foodId, delta) => {
    setCart((c) =>
      c
        .map((i) =>
          i.food === foodId ? { ...i, quantity: i.quantity + delta } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const placeOrder = async () => {
    if (!user) return navigate("/login");
    if (cart.length === 0) return;
    setPlacing(true);
    setOrderError("");
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
      setOrderError(err.response?.data?.message || "Order failed");
    } finally {
      setPlacing(false);
    }
  };

  const total = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart],
  );
  const itemCount = useMemo(
    () => cart.reduce((s, i) => s + i.quantity, 0),
    [cart],
  );

  if (!restaurant) return <Skeleton />;

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1e1b1a]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#8b7e72]">
          <Link
            to="/restaurants"
            className="hover:text-[#1e1b1a] transition-colors"
          >
            Restaurants
          </Link>
          <span className="mx-2 text-[#b8a99c]">/</span>
          <span className="text-[#1e1b1a] truncate">{restaurant.title}</span>
        </nav>

        {/* ===== RESTAURANT HEADER ===== */}
        <header className="border-b border-[#e8e2db] pb-10 mb-10">
          <div className="relative h-56 lg:h-72 overflow-hidden bg-[#f0ece7] mb-8">
            <img
              src={restaurant.image}
              alt={restaurant.title}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              onError={(e) => (e.currentTarget.style.opacity = "0")}
            />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-tight mb-3">
                {restaurant.title}
              </h1>
              {restaurant.foodType?.length > 0 && (
                <p className="text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#8b7e72]">
                  {restaurant.foodType.join(" · ")}
                </p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-[#8b7e72] mb-1">
                  Rating
                </p>
                <p className="font-serif text-2xl font-medium leading-none">
                  {(Number(restaurant.rating) || 0).toFixed(1)}
                  <span className="text-[#b8a99c] text-base font-normal">
                    {" "}
                    ({restaurant.ratingcount || 0})
                  </span>
                </p>
              </div>
              {restaurant.delivery && (
                <>
                  <span className="w-px h-10 bg-[#e8e2db]" />
                  <div>
                    <p className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-[#8b7e72] mb-1">
                      Service
                    </p>
                    <p className="text-sm font-medium text-[#1e1b1a]">
                      {restaurant.delivery && "Delivery"}
                      {restaurant.delivery && restaurant.pickup && " · "}
                      {restaurant.pickup && "Pickup"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* MENU */}
          <section className="lg:col-span-2">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
                Menu
              </h2>
              <span className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-[#8b7e72]">
                {foods.length} {foods.length === 1 ? "item" : "items"}
              </span>
            </div>

            {error && (
              <div className="mb-6 border-l-[3px] border-[#b03e2e] bg-[#f5ebe8] px-4 py-3 text-sm text-[#7a2a1f]">
                {error}
              </div>
            )}

            {foods.length === 0 ? (
              <div className="border border-dashed border-[#d9d2cb] px-6 py-16 text-center">
                <p className="font-serif text-xl tracking-tight mb-2">
                  No food items yet
                </p>
                <p className="text-sm text-[#8b7e72] font-light">
                  This kitchen hasn't added any dishes.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {foods.map((f) => {
                  const inCart = cart.find((i) => i.food === f._id);
                  return (
                    <article
                      key={f._id}
                      className="group border border-[#e8e2db] bg-white p-4 flex gap-4 hover:shadow-[0_8px_30px_-15px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                    >
                      <div className="w-24 h-24 shrink-0 overflow-hidden bg-[#f0ece7]">
                        <img
                          src={f.image}
                          alt={f.title}
                          loading="lazy"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          onError={(e) => (e.currentTarget.style.opacity = "0")}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg tracking-tight truncate">
                          {f.title}
                        </h3>
                        {f.description && (
                          <p className="text-sm text-[#6b625a] font-light leading-snug mt-1 line-clamp-2">
                            {f.description}
                          </p>
                        )}
                        <p className="font-serif text-lg font-medium mt-2 tracking-tight">
                          {CURRENCY}
                          {f.price}
                        </p>
                      </div>

                      <div className="self-center flex flex-col items-end gap-2">
                        {inCart ? (
                          <div className="flex items-center border border-[#1e1b1a]">
                            <button
                              onClick={() => updateQuantity(f._id, -1)}
                              className="w-8 h-9 flex items-center justify-center text-[#1e1b1a] hover:bg-[#1e1b1a] hover:text-[#faf9f7] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              &minus;
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(f._id, 1)}
                              className="w-8 h-9 flex items-center justify-center text-[#1e1b1a] hover:bg-[#1e1b1a] hover:text-[#faf9f7] transition-colors"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(f)}
                            className="inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-[0.65rem] font-semibold tracking-[0.14em] uppercase px-4 py-2 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* CART */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 border border-[#e8e2db] bg-white p-6">
              <div className="flex items-baseline justify-between border-b border-[#e8e2db] pb-4 mb-4">
                <h3 className="font-serif text-xl tracking-tight">
                  Your order
                </h3>
                <span className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-[#8b7e72]">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              {cart.length === 0 ? (
                <p className="text-sm text-[#8b7e72] font-light py-6 text-center">
                  Your cart is empty. Add something from the menu.
                </p>
              ) : (
                <>
                  <ul className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                    {cart.map((i) => (
                      <li
                        key={i.food}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="text-[#1e1b1a] font-medium truncate">
                            {i.title}
                          </p>
                          <p className="text-[0.7rem] text-[#8b7e72] mt-0.5">
                            {CURRENCY}
                            {i.price} × {i.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-semibold tabular-nums">
                            {CURRENCY}
                            {(i.price * i.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(i.food)}
                            className="text-[#b8a99c] hover:text-[#b03e2e] transition-colors text-base leading-none"
                            aria-label={`Remove ${i.title}`}
                          >
                            &times;
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-[#e8e2db] mt-5 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-[#6b625a]">
                      <span>Subtotal</span>
                      <span className="tabular-nums">
                        {CURRENCY}
                        {total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#6b625a]">
                      <span>Delivery</span>
                      <span className="text-[#4a7c4a] font-medium">Free</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-3 border-t border-[#e8e2db]">
                      <span className="text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-[#1e1b1a]">
                        Total
                      </span>
                      <span className="font-serif text-2xl font-medium tracking-tight tabular-nums">
                        {CURRENCY}
                        {total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {orderError && (
                    <div className="mt-4 border-l-[3px] border-[#b03e2e] bg-[#f5ebe8] px-3 py-2 text-xs text-[#7a2a1f] leading-relaxed">
                      {orderError}
                    </div>
                  )}

                  <button
                    onClick={placeOrder}
                    disabled={placing}
                    className="mt-5 w-full inline-flex items-center justify-center bg-[#1e1b1a] text-[#faf9f7] text-xs font-medium tracking-[0.14em] uppercase px-6 py-4 border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {placing ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Placing order
                      </span>
                    ) : (
                      "Place order"
                    )}
                  </button>

                  {!user && (
                    <p className="mt-3 text-[0.7rem] text-[#8b7e72] text-center">
                      You'll be asked to{" "}
                      <Link
                        to="/login"
                        className="underline underline-offset-2 hover:text-[#1e1b1a]"
                      >
                        sign in
                      </Link>{" "}
                      to complete this order.
                    </p>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

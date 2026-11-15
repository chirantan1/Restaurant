import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl font-bold mb-4">🍔 Order your favorite food</h1>
      <p className="text-gray-600 text-lg mb-8">
        Fast delivery, fresh food, great taste.
      </p>
      <Link to="/restaurants" className="btn-primary text-lg px-8 py-3">
        Browse Restaurants
      </Link>
    </div>
  );
}

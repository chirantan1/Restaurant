import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-red-500">
          🍔 FoodApp
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4 text-sm">
          <Link to="/restaurants" className="hover:text-red-500">
            Restaurants
          </Link>

          {user && (
            <Link to="/my-orders" className="hover:text-red-500">
              My Orders
            </Link>
          )}

          {user?.userType === "vendor" && (
            <Link to="/vendor" className="hover:text-red-500">
              Vendor
            </Link>
          )}

          {user?.userType === "admin" && (
            <Link to="/admin" className="hover:text-red-500">
              Admin
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile" className="hover:text-red-500">
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-red-500">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

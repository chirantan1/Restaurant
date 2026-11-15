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
    <nav className="bg-[#faf9f7] border-b border-[#e8e2db] sticky top-0 z-40 backdrop-blur-sm bg-[#faf9f7]/90">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-5 flex items-center justify-between gap-8">
        {/* Logo — wordmark instead of emoji */}
        <Link
          to="/"
          className="font-serif text-2xl font-semibold tracking-tight text-[#1e1b1a] leading-none shrink-0"
        >
          Feast<span className="italic font-normal text-[#8b7e72]">.</span>
        </Link>

        {/* Primary nav links */}
        <div className="hidden md:flex items-center gap-8 text-[0.7rem] font-medium tracking-[0.14em] uppercase">
          <Link
            to="/restaurants"
            className="text-[#4a423c] hover:text-[#1e1b1a] border-b border-transparent hover:border-[#1e1b1a] pb-1 transition-all duration-200"
          >
            Restaurants
          </Link>

          {user && (
            <Link
              to="/my-orders"
              className="text-[#4a423c] hover:text-[#1e1b1a] border-b border-transparent hover:border-[#1e1b1a] pb-1 transition-all duration-200"
            >
              My Orders
            </Link>
          )}

          {user?.userType === "vendor" && (
            <Link
              to="/vendor"
              className="text-[#4a423c] hover:text-[#1e1b1a] border-b border-transparent hover:border-[#1e1b1a] pb-1 transition-all duration-200"
            >
              Vendor
            </Link>
          )}

          {user?.userType === "admin" && (
            <Link
              to="/admin"
              className="text-[#4a423c] hover:text-[#1e1b1a] border-b border-transparent hover:border-[#1e1b1a] pb-1 transition-all duration-200"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Account actions */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link
                to="/profile"
                className="hidden sm:inline-flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#4a423c] hover:text-[#1e1b1a] transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-[#e8e2db] flex items-center justify-center text-[0.65rem] font-semibold text-[#1e1b1a] tracking-normal">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[100px] truncate normal-case tracking-normal text-sm font-normal">
                  {user.username}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-[0.7rem] font-medium tracking-[0.12em] uppercase px-5 py-2.5 border border-[#d9d2cb] text-[#1e1b1a] hover:border-[#1e1b1a] hover:bg-[#1e1b1a] hover:text-[#faf9f7] transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-[#4a423c] hover:text-[#1e1b1a] px-3 py-2.5 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-[0.7rem] font-medium tracking-[0.12em] uppercase px-5 py-2.5 bg-[#1e1b1a] text-[#faf9f7] border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
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

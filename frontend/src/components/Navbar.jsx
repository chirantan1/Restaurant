import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/restaurants", label: "Restaurants", show: true },
    { to: "/my-orders", label: "My Orders", show: !!user },
    { to: "/vendor", label: "Vendor", show: user?.userType === "vendor" },
    { to: "/admin", label: "Admin", show: user?.userType === "admin" },
  ].filter((l) => l.show);

  return (
    <nav className="bg-[#faf9f7] border-b border-[#e8e2db] sticky top-0 z-40 backdrop-blur-sm bg-[#faf9f7]/90">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5 flex items-center justify-between gap-4 sm:gap-8">
        {/* Logo */}
        <Link
          to="/"
          className="font-serif text-2xl font-semibold tracking-tight text-[#1e1b1a] leading-none shrink-0"
        >
          Feast<span className="italic font-normal text-[#8b7e72]">.</span>
        </Link>

        {/* Primary nav links (desktop only) */}
        <div className="hidden md:flex items-center gap-8 text-[0.7rem] font-medium tracking-[0.14em] uppercase">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[#4a423c] hover:text-[#1e1b1a] border-b border-transparent hover:border-[#1e1b1a] pb-1 transition-all duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Account actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
                className="hidden sm:inline-flex text-[0.7rem] font-medium tracking-[0.12em] uppercase px-5 py-2.5 border border-[#d9d2cb] text-[#1e1b1a] hover:border-[#1e1b1a] hover:bg-[#1e1b1a] hover:text-[#faf9f7] transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex text-[0.7rem] font-medium tracking-[0.12em] uppercase text-[#4a423c] hover:text-[#1e1b1a] px-3 py-2.5 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-flex text-[0.7rem] font-medium tracking-[0.12em] uppercase px-4 sm:px-5 py-2.5 bg-[#1e1b1a] text-[#faf9f7] border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
              >
                Register
              </Link>
            </>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden inline-flex flex-col items-center justify-center w-10 h-10 border border-[#d9d2cb] hover:border-[#1e1b1a] transition-colors"
          >
            <span
              className={`block w-4 h-px bg-[#1e1b1a] transition-transform duration-200 ${
                menuOpen ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-4 h-px bg-[#1e1b1a] mt-[3px] transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-4 h-px bg-[#1e1b1a] mt-[3px] transition-transform duration-200 ${
                menuOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ===== MOBILE DRAWER ===== */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#e8e2db] bg-[#faf9f7]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 space-y-1">
            {/* Nav links */}
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block px-3 py-3 text-[0.7rem] font-medium tracking-[0.14em] uppercase text-[#4a423c] hover:text-[#1e1b1a] hover:bg-[#f0ece7] transition-colors"
              >
                {l.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="h-px bg-[#e8e2db] my-3" />

            {/* Account section */}
            {user ? (
              <div className="space-y-3 pt-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#f0ece7] transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-[#e8e2db] flex items-center justify-center text-sm font-semibold text-[#1e1b1a]">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1e1b1a] truncate">
                      {user.username}
                    </p>
                    <p className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-[#8b7e72]">
                      View profile
                    </p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-[0.7rem] font-medium tracking-[0.12em] uppercase px-4 py-3 border border-[#d9d2cb] text-[#1e1b1a] hover:border-[#1e1b1a] hover:bg-[#1e1b1a] hover:text-[#faf9f7] transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link
                  to="/login"
                  className="flex-1 inline-flex items-center justify-center text-[0.7rem] font-medium tracking-[0.12em] uppercase px-4 py-3 border border-[#d9d2cb] text-[#1e1b1a] hover:border-[#1e1b1a] transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 inline-flex items-center justify-center text-[0.7rem] font-medium tracking-[0.12em] uppercase px-4 py-3 bg-[#1e1b1a] text-[#faf9f7] border border-[#1e1b1a] hover:bg-transparent hover:text-[#1e1b1a] transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import { useEffect, useState } from "react";
import logo from "/logo3.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { cartCount } = useCart();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userID");
        if (!token || !userId) {
          setIsLoggedIn(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:4000/api/users/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error fetching user data", error);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userID");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = (
    <>
      <li>
        <Link to="/" className={isActive("/") ? "text-green" : ""}>
          Home
        </Link>
      </li>
      {isLoggedIn && (
        <>
          <li>
            <Link to="/Menu" className={isActive("/Menu") ? "text-green" : ""}>
              Menu
            </Link>
          </li>
          <li>
            <Link
              to="/custom"
              className={isActive("/custom") ? "text-green" : ""}
            >
              Custom Your Dish
            </Link>
          </li>
        </>
      )}
      <li>
        <Link
          to="/contact"
          className={isActive("/contact") ? "text-green" : ""}
        >
          Get In Touch
        </Link>
      </li>
    </>
  );

  return (
    <header
      className={`max-w-screen-2xl container mx-auto fixed top-0 left-0 right-0 transition-all duration-300 ease-in-out`}
    >
      <div
        className={`navbar xl:px-24 ${
          isSticky
            ? "shadow-md bg-white transition-all duration-300 ease-in-out"
            : "bg-white"
        }`}
      >
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64 space-y-3"
            >
              {navItems}
            </ul>
          </div>
          <Link
            to="/"
            className="text-xl font-bold text-green text-center "
          >
            Food Ordering Information System
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>
        <div className="navbar-end">
          {isLoggedIn && (
            <Link
              to="/Cart"
              className="btn btn-ghost btn-circle lg:flex items-center justify-center mr-3"
            >
              <div className="indicator">
                <FaShoppingCart size={24} />
                <span className="badge badge-sm indicator-item">
                  {cartCount}
                </span>
              </div>
            </Link>
          )}
          {isLoggedIn && (
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle lg:flex items-center justify-center mr-3"
            >
              <div className="indicator">
                <Link to="/profile">
                  {user && user.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={40} className="text-green-500" />
                  )}
                </Link>
              </div>
            </label>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="btn flex items-center gap-2 rounded-full px-6 bg-green text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="btn flex items-center gap-2 rounded-full px-6 bg-green text-white"
            >
              <FaRegUser /> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

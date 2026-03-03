import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("driverID");
    localStorage.removeItem("driverToken");
    navigate("/");
  };

  const getLinkClassName = (path) => {
    return location.pathname === path
      ? "text-green"
      : "text-gray-700 hover:text-gray-900";
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/driver-dashboard" className="flex-shrink-0">
              <img src="logo3.png" alt="admin logo" className="h-12 w-auto" />
            </Link>
            <h2 className="ml-4 text-xl font-bold">Driver Panel</h2>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/driver-dashboard"
              className={`${getLinkClassName("/driver-dashboard")}`}
            >
              Home
            </Link>
            <Link
              to="/driver-orders"
              className={`${getLinkClassName("/driver-orders")}`}
            >
              Orders
            </Link>
            <button
              onClick={handleLogout}
              className="btn  flex items-center gap-2 px-4 bg-green text-white"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/driver-dashboard"
              className={`block px-3 py-2 ${getLinkClassName(
                "/driver-dashboard"
              )}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/driver-orders"
              className={`block px-3 py-2 ${getLinkClassName(
                "/driver-orders"
              )}`}
              onClick={() => setIsOpen(false)}
            >
              Orders
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

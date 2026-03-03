import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="w-full md:w-64 bg-white shadow-md h-full">
      <div className="p-4">
        <Link to="/home">
          <h2 className="text-2xl font-bold text-gray-800 my-5">
            Food Ordering Information System{" "}
            <span className="text-green">Admin</span>
          </h2>
        </Link>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/home"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/booking"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Manage Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/add-menu"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Add Menu
              </Link>
            </li>
            <li>
              <Link
                to="/manage-items"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Manage Items
              </Link>
            </li>
            <li>
              <Link
                to="/user"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Users
              </Link>
            </li>

            <li>
              <Link
                to="/support"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Customer Support
              </Link>
            </li>
            <li>
              <Link
                to="/custom-food"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Custom Food
              </Link>
            </li>
            <li>
              <Link
                to="/Feedback"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Feedback
              </Link>
            </li>
            <li>
              <Link
                to="/Driver"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Driver Request
              </Link>
            </li>
            <li>
              <Link
                to="/Food-soon"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Add Food Soon
              </Link>
            </li>
            <li>
              <Link
                to="/Manage-Food-soon"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Manage Food Soon
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded transition duration-200"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

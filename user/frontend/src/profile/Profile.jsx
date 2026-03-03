import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { FaUserCircle, FaPhone } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";

export default function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePhotoLink: "",
  });
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [customFoods, setCustomFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeSection, setActiveSection] = useState("editProfile");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { updateCartCount } = useCart();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userID");

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setFormData({
          name: response.data.user.name,
          email: response.data.user.email,
          password: "",
          profilePhotoLink: response.data.user.image || "",
        });

        setCustomFoods(response.data.customFoods);

        const favoritesResponse = await axios.get(
          `http://localhost:4000/api/users/${userId}/favorites`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setFavoriteItems(favoritesResponse.data);

        const ordersResponse = await axios.get(
          "http://localhost:4000/api/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setOrders(ordersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userID");
          navigate("/login");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error fetching profile",
            text: "Failed to load user data. Please try again later.",
          });
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleAddToCart = async (itemId) => {
    try {
      const userId = localStorage.getItem("userID");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        console.error("User ID or token not found");
        return;
      }

      const response = await axios.post(
        `http://localhost:4000/api/cart/add`,
        { itemId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const countResponse = await axios.get(
          "http://localhost:4000/api/cart/count",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        updateCartCount(countResponse.data.count);

        const addedItem = items.find((item) => item._id === itemId);
        const itemName = addedItem ? addedItem.recipeName : "Item";

        Swal.fire({
          title: "Added to Cart!",
          text: `${itemName} added to cart successfully`,
          icon: "success",
          confirmButtonColor: "#4CAF50",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add item to cart. Please try again.",
        icon: "error",
        confirmButtonColor: "#4CAF50",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePhotoLink: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userID");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:4000/api/users/profile/${userId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Profile updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userID");
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to update profile",
          text: error.response?.data?.message || "An error occurred",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    Swal.fire({
      title: "Order Details",
      html: `
        <p><strong>Order Date:</strong> ${order.orderDate}</p>
        <p><strong>Price:</strong> JD${order.price}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Driver Name:</strong> ${
          order.assignedDriver?.name
            ? order.assignedDriver.name
            : "Not assigned yet"
        }</p>
        <p><strong>Delivery Address:</strong> ${order.deliveryInfo.address}, ${
        order.deliveryInfo.city
      }, ${order.deliveryInfo.state} ${order.deliveryInfo.zipCode}</p>
        <h3>Order Summary:</h3>
        <ul>
          ${order.orderSummary.items
            .map(
              (item) => `
            <li>${item.name} - Quantity: ${
                item.quantity
              }, Price: JD${item.price.toFixed(2)}</li>
          `
            )
            .join("")}
        </ul>
        <p><strong>Total Items:</strong> ${order.orderSummary.itemCount}</p>
        <p><strong>Total Price:</strong> JD${order.orderSummary.totalPrice.toFixed(
          2
        )}</p>
      `,
      confirmButtonText: "Close",
    });
  };

  const handleContactDriver = (order) => {
    if (order.assignedDriver && order.assignedDriver.phone) {
      const phoneNumber = order.assignedDriver.phone;

      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        window.location.href = `tel:${phoneNumber}`;
      } else {
        Swal.fire({
          title: "Driver Contact",
          html: `
            <p>Please call the driver at:</p>
            <h2 class="text-xl font-bold">${phoneNumber}</h2>
          `,
          icon: "info",
          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        icon: "info",
        title: "No driver assigned yet",
        text: "The driver has not been assigned to this order or their contact information is not available.",
      });
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-4 md:p-8">
      <Navbar />

      <div className="flex flex-col justify-center items-center min-h-screen space-y-8">
        <div className="w-full max-w-6xl bg-white shadow-md rounded-md p-6 mt-20">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setActiveSection("editProfile")}
              className={`px-4 py-2 rounded-md ${
                activeSection === "editProfile"
                  ? "bg-green text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveSection("favoriteFood")}
              className={`px-4 py-2 rounded-md ${
                activeSection === "favoriteFood"
                  ? "bg-green text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Favorite Food
            </button>
            <button
              onClick={() => setActiveSection("customFood")}
              className={`px-4 py-2 rounded-md ${
                activeSection === "customFood"
                  ? "bg-green text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Custom Dish
            </button>
            <button
              onClick={() => setActiveSection("orders")}
              className={`px-4 py-2 rounded-md ${
                activeSection === "orders"
                  ? "bg-green text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Orders
            </button>
          </div>

          {activeSection === "editProfile" && (
            <div className="w-full max-w-md mx-auto">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-center">
                Edit Profile
              </h3>

              <div className="flex justify-center mb-4">
                <label
                  htmlFor="profilePhoto"
                  className="flex flex-col items-center cursor-pointer"
                >
                  {formData.profilePhotoLink ? (
                    <img
                      src={formData.profilePhotoLink}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={100} className="text-green" />
                  )}
                  <input
                    type="file"
                    id="profilePhoto"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-4 py-2 border border-gray-300 rounded-md bg-white"
                    placeholder="Your Name"
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-4 py-2 border border-gray-300 rounded-md bg-white"
                    placeholder="Email"
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-4 py-2 border border-gray-300 rounded-md bg-white"
                    placeholder="Enter a new password to change"
                  />
                </div>

                <label
                  htmlFor="profilePhotoLink"
                  className="block text-sm font-medium mb-1"
                >
                  Profile Photo Link
                </label>
                <input
                  type="text"
                  id="profilePhotoLink"
                  value={formData.profilePhotoLink}
                  onChange={handleChange}
                  className="w-full pl-4 py-2 border border-gray-300 rounded-md bg-white"
                  placeholder="Profile Photo Link"
                />

                <button
                  type="submit"
                  className="w-full bg-green text-white py-2 rounded-md hover:bg-black"
                >
                  Update
                </button>
              </form>
            </div>
          )}

          {activeSection === "favoriteFood" && (
            <div>
              <h2 className="text-center text-2xl font-bold mb-6">
                Favorite Food
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoriteItems.map((item) => (
                  <div
                    key={item._id}
                    className="card bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
                  >
                    <figure>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="hover:scale-105 transition-all duration-300 md:h-72"
                      />
                    </figure>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">
                        {item.recipeName}
                      </h3>
                      <p className="text-green-600 font-bold mb-4">
                        JD{item.price.toFixed(2)}
                      </p>
                      <button
                        className="bg-green text-white px-4 py-2 rounded-lg hover:bg-black transition-colors duration-300"
                        onClick={() => handleAddToCart(item._id)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "customFood" && (
            <div>
              <h2 className="text-center text-2xl font-bold mb-6">
                Custom Food
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {customFoods.map((item) => (
                  <div
                    key={item._id}
                    className="card bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
                  >
                    <figure>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="hover:scale-105 transition-all duration-300 md:h-72"
                      />
                    </figure>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-gray-700 mb-2">{item.notes}</p>
                      <p className="text-green-600 font-bold mb-4">
                        JD{item.price}
                      </p>
                      <button className="bg-green text-white px-4 py-2 rounded-lg hover:bg-black transition-colors duration-300">
                        Add to cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "orders" && (
            <div>
              <h2 className="text-center text-2xl font-bold mb-6">
                Your Orders
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-green text-white uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">#</th>
                      <th className="py-3 px-6 text-left">Order Date</th>
                      <th className="py-3 px-6 text-left">Driver Name</th>
                      <th className="py-3 px-6 text-left">Price</th>
                      <th className="py-3 px-6 text-left">Status</th>
                      <th className="py-3 px-6 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {orders.map((order, index) => (
                      <tr
                        key={order.transactionId}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {order.orderDate}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {order.assignedDriver?.name
                            ? order.assignedDriver.name
                            : "Not assigned yet"}
                        </td>
                        <td className="py-3 px-6 text-left">JD{order.price}</td>
                        <td className="py-3 px-6 text-left">
                          <span
                            className={`py-1 px-3 rounded-full text-xs ${
                              order.status === "completed"
                                ? "bg-green"
                                : order.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red"
                            } text-white`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-blue-600 hover:text-blue-800 mr-2"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleContactDriver(order)}
                            className="text-green hover:text-black flex items-center"
                          >
                            <FaPhone className="mr-1" /> Contact
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

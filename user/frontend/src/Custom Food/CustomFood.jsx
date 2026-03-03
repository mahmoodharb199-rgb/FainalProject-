import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CustomFood() {
  const [formData, setFormData] = useState({
    name: "",
    notes: "",
    image: "",
    quantity: 1,
  });
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [approvedCustomItems, setApprovedCustomItems] = useState([]);
  const { updateCartCount } = useCart();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userID");
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
      fetchApprovedCustomItems(storedToken, storedUserId);
    }

    const today = new Date();
    const startDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    setCanSubmit(today >= startDate);

    if (!canSubmit) {
      setShowWarning(true);
    }
  }, [canSubmit]);

  const fetchApprovedCustomItems = async (token, userId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/custom-food/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setApprovedCustomItems(
        response.data.customFoodItems.filter((item) => item.isApproved)
      );
    } catch (error) {
      console.error("Error fetching approved custom items:", error);
      Swal.fire("Error", "Failed to fetch approved custom items", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/custom-food",
        { ...formData, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Your custom dish has been submitted for approval.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setFormData({ name: "", notes: "", image: "", quantity: 1 });
        fetchApprovedCustomItems(token, userId);
      }
    } catch (error) {
      console.error("Error submitting custom dish:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Failed to submit custom dish. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleWarningOk = () => {
    setShowWarning(false);
  };

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:4000/api/custom-food/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire(
          "Deleted!",
          "Your custom dish item has been deleted.",
          "success"
        );
        fetchApprovedCustomItems(token, userId);
      } catch (error) {
        console.error("Error deleting custom dish:", error);
        Swal.fire("Error", "Failed to delete custom dish item", "error");
      }
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/cart/add",
        { itemId, quantity: 1, isCustom: true },
        { headers: { Authorization: `Bearer ${token}` } }
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
        Swal.fire("Success", "Item added to cart", "success");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      Swal.fire("Error", "Failed to add item to cart", "error");
    }
  };

  if (!token || !userId) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-1 flex justify-center items-center">
          <p className="text-xl">Please log in to submit a custom dish.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center p-6 mt-20">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Add Custom Dish
          </h1>
          <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Food Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green sm:text-sm bg-white"
                placeholder="Enter food name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green sm:text-sm bg-white"
                placeholder="Add any notes about the food"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green sm:text-sm bg-white"
                placeholder="Enter image URL"
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green sm:text-sm bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green text-white py-3 px-6 rounded-lg shadow-md hover:bg-black focus:outline-none focus:ring-2"
            >
              Send
            </button>
          </form>
        </div>

        <div className="w-full max-w-6xl bg-white shadow-md rounded-md p-6">
          <h2 className="text-center text-2xl font-bold mb-6">
            Approved Custom Dish Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {approvedCustomItems.map((item) => (
              <div
                key={item._id}
                className="card bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
              >
                <figure>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-72 object-cover hover:scale-105 transition-all duration-300"
                  />
                </figure>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-700 mb-2">{item.notes}</p>
                  <p className="text-green-600 font-bold mb-2">${item.price}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Quantity: {item.quantity}
                  </p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleAddToCart(item._id)}
                      className="bg-green text-white px-4 py-2 rounded-lg hover:bg-black transition-colors duration-300 flex items-center"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Add to cart
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red text-white px-4 py-2 rounded-lg hover:bg-orange-800 transition-colors duration-300 flex items-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Reminder
            </h2>
            <p className="text-gray-700 mb-4">
              Please remember to submit your order at least two days in advance.
            </p>
            <button
              onClick={handleWarningOk}
              className="w-full bg-green text-white py-2 px-4 rounded-lg shadow-md hover:bg-black focus:outline-none focus:ring-2"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

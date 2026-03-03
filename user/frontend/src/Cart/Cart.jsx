import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useCart } from ".././context/CartContext";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [user, setUser] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const { updateCartCount } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCartItems();
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cartItems, customItems]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found, skipping cart fetch");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:4000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data) {
        setCartItems(response.data.items || []);
        setCustomItems(response.data.customItems || []);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Authentication needed");
      } else if (error.response?.status === 404) {
        console.log("Cart is empty");
        setCartItems([]);
        setCustomItems([]);
      } else {
        console.log("Cart fetch error:", error.message);
      }

      setCartItems([]);
      setCustomItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userID");

      if (!token || !userId) {
        console.log("User details not available");
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/api/users/profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log("User details fetch skipped:", error.message);
    }
  };

  const calculateTotals = () => {
    const regularItemsCount = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const customItemsCount = customItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalCount = regularItemsCount + customItemsCount;

    updateCartCount(totalCount);

    const regularItemsTotal = cartItems.reduce(
      (sum, item) => sum + (item.menuItem?.price || 0) * item.quantity,
      0
    );
    const customItemsTotal = customItems.reduce(
      (sum, item) => sum + (item.customFood?.price || 0) * item.quantity,
      0
    );
    setTotalPrice(regularItemsTotal + customItemsTotal);
  };

  const handleQuantityChange = async (
    itemId,
    newQuantity,
    isCustom = false
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (newQuantity < 1) {
        await handleRemoveItem(itemId, isCustom);
      } else {
        await axios.post(
          "http://localhost:4000/api/cart/update",
          { itemId, quantity: newQuantity, isCustom },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (isCustom) {
          setCustomItems((prevItems) =>
            prevItems.map((item) =>
              item.customFood._id === itemId
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
        } else {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.menuItem._id === itemId
                ? { ...item, quantity: newQuantity }
                : item
            )
          );
        }

        const newTotalCount = isCustom
          ? customItems.reduce(
              (sum, item) =>
                sum +
                (item.customFood._id === itemId ? newQuantity : item.quantity),
              0
            ) + cartItems.reduce((sum, item) => sum + item.quantity, 0)
          : cartItems.reduce(
              (sum, item) =>
                sum +
                (item.menuItem._id === itemId ? newQuantity : item.quantity),
              0
            ) + customItems.reduce((sum, item) => sum + item.quantity, 0);
        updateCartCount(newTotalCount);
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Unable to update quantity. Please try again.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleRemoveItem = async (itemId, isCustom = false) => {
    const item = isCustom
      ? customItems.find((item) => item.customFood._id === itemId)
      : cartItems.find((item) => item.menuItem._id === itemId);
    if (!item) return;

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to remove ${
          isCustom ? item.customFood.name : item.menuItem.recipeName
        } from your cart?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `http://localhost:4000/api/cart/remove/${itemId}?isCustom=${isCustom}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (isCustom) {
          setCustomItems((prevItems) =>
            prevItems.filter((item) => item.customFood._id !== itemId)
          );
        } else {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.menuItem._id !== itemId)
          );
        }

        updateCartCount(response.data?.cartCount || 0);

        Swal.fire({
          icon: "success",
          title: "Removed!",
          text: `${
            isCustom ? item.customFood.name : item.menuItem.recipeName
          } has been removed from your cart.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Unable to remove item. Please try again.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Please log in to view your cart
            </h2>
            <Link to="/login">
              <button className="px-6 py-3 bg-green text-white rounded-lg hover:bg-green-600 transition-colors">
                Go to Login
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0 && customItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC]">
            <div className="py-24 md:py-48 flex flex-col items-center justify-center">
              <div className="text-center px-4 space-y-4 md:space-y-7">
                <h2 className="text-3xl md:text-5xl font-bold leading-snug">
                  Your <span className="text-green">Cart</span> is Empty
                </h2>
                <p className="text-gray-600 text-lg">
                  Looks like you haven't added anything to your cart yet
                </p>
                <div className="space-x-4">
                  <Link to="/Menu">
                    <button className="px-6 py-3 bg-green text-white rounded-full hover:bg-green-600 transition-colors">
                      Browse Menu
                    </button>
                  </Link>
                  <Link to="/custom">
                    <button className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors">
                      Create Custom Dish
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <Navbar />

      {/* Menu Banner */}
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC]">
        <div className="py-24 md:py-48 flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-4 md:space-y-7">
            <h2 className="text-3xl md:text-5xl font-bold leading-snug">
              Items Added to the <span className="text-green">Cart</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Regular Cart Items Table */}
      {cartItems.length > 0 && (
        <div className="overflow-x-auto mb-8 md:mb-12 px-4 md:px-16">
          <h3 className="text-xl font-semibold mb-4">Regular Cart Items</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green">
              <tr>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  No.
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Food
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cartItems.map((item, index) => (
                <tr key={item.menuItem._id}>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500 flex items-center space-x-2">
                    <img
                      src={item.menuItem.imageUrl}
                      alt={item.menuItem.recipeName}
                      className="w-8 h-8 md:w-12 md:h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {item.menuItem.recipeName}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-2 py-1 bg-gray-300 rounded text-gray-700 hover:bg-gray-400 text-sm md:text-base"
                        onClick={() =>
                          handleQuantityChange(
                            item.menuItem._id,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span className="text-sm text-gray-700 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 py-1 bg-gray-300 rounded text-gray-700 hover:bg-gray-400 text-sm md:text-base"
                        onClick={() =>
                          handleQuantityChange(
                            item.menuItem._id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    JD{(item.menuItem.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm font-medium">
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => handleRemoveItem(item.menuItem._id)}
                    >
                      <FaTrash className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Cart Items Table */}
      {customItems.length > 0 && (
        <div className="overflow-x-auto mb-8 md:mb-12 px-4 md:px-16">
          <h3 className="text-xl font-semibold mb-4">Custom Cart Items</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green">
              <tr>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  No.
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Food
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customItems.map((item, index) => (
                <tr key={item.customFood._id}>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500 flex items-center space-x-2">
                    <img
                      src={item.customFood.image}
                      alt={item.customFood.name}
                      className="w-8 h-8 md:w-12 md:h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {item.customFood.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-2 py-1 bg-gray-300 rounded text-gray-700 hover:bg-gray-400 text-sm md:text-base"
                        onClick={() =>
                          handleQuantityChange(
                            item.customFood._id,
                            item.quantity - 1,
                            true
                          )
                        }
                      >
                        -
                      </button>
                      <span className="text-sm text-gray-700 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 py-1 bg-gray-300 rounded text-gray-700 hover:bg-gray-400 text-sm md:text-base"
                        onClick={() =>
                          handleQuantityChange(
                            item.customFood._id,
                            item.quantity + 1,
                            true
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    JD{(item.customFood.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm font-medium">
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() =>
                        handleRemoveItem(item.customFood._id, true)
                      }
                    >
                      <FaTrash className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer and Shopping Details */}
      <div className="flex flex-col md:flex-row justify-between mb-8 md:mb-12 px-4 md:px-16">
        <div className="flex-1 mb-8 md:mb-0 md:mr-8">
          <h3 className="text-lg md:text-xl font-semibold mb-4">
            Customer Details
          </h3>
          <div className="space-y-2">
            <p>
              <strong className="text-green">Name:</strong>{" "}
              {user?.name || "Guest"}
            </p>
            <p>
              <strong className="text-green">Email:</strong>{" "}
              {user?.email || "Not provided"}
            </p>
          </div>
        </div>

        {/* Shopping Details */}
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-semibold mb-4">
            Shopping Details
          </h3>
          <div className="space-y-2">
            <p>
              <strong className="text-green">Total Items:</strong>{" "}
              {cartItems.reduce((sum, item) => sum + item.quantity, 0) +
                customItems.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
            <p>
              <strong className="text-green">Total Price:</strong> JD
              {totalPrice.toFixed(2)}
            </p>
          </div>
          <Link to="/Menu/Cart/payment">
            <button className="mt-4 px-6 py-3 bg-green text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

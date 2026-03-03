import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useCart } from "../context/CartContext";

const itemsPerPage = 6;

const Card = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedItems, setLikedItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState(["all"]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const location = useLocation();
  const isProfilePage = location.pathname.includes("/profile");
  const { updateCartCount } = useCart();

  const token = localStorage.getItem("token");

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      console.log("Fetching with params:", params);

      const response = await axios.get(`http://localhost:4000/api/menu-items`, {
        params: params,
      });

      setItems(response.data.items || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchCategories();
    fetchLikedItems();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/categories");
      setCategories(["all", ...response.data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchLikedItems = async () => {
    try {
      const userId = localStorage.getItem("userID");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        console.error("User ID or token not found");
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/api/users/${userId}/favorites`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const likedItemsMap = {};
      response.data.forEach((item) => {
        likedItemsMap[item._id] = true;
      });
      setLikedItems(likedItemsMap);
    } catch (error) {
      console.error("Error fetching liked items:", error);
    }
  };

  const handleHeartClick = async (id) => {
    try {
      const userId = localStorage.getItem("userID");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        console.error("User ID or token not found");
        return;
      }

      const isLiked = likedItems[id];

      const response = await axios.post(
        `http://localhost:4000/api/users/${userId}/favorite`,
        { itemId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setLikedItems((prev) => {
          const newLikedItems = { ...prev };
          if (isLiked) {
            delete newLikedItems[id];
          } else {
            newLikedItems[id] = true;
          }
          return newLikedItems;
        });

        if (isProfilePage && isLiked) {
          setItems((prevItems) => prevItems.filter((item) => item._id !== id));
        }
      }
    } catch (error) {
      console.error("Error updating favorite food:", error);
    }
  };

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    setCurrentPage(1);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {}, 500);

    setSearchTimeout(newTimeout);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setSearchQuery("");
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-1 flex justify-center items-center">
          <p className="text-xl font-semibold text-gray-700">
            Please log in to show our menu.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-48 flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              For the Love of Delicious <span className="text-green">Food</span>
            </h2>
            <p className="text-[#4A4A4A] text-xl md:w-4/5 mx-auto">
              Come with family & feel the joy of mouthwatering food
            </p>
            <div className="space-x-4">
              <Link to="/custom">
                <button className="bg-green font-semibold btn text-white px-8 py-3 rounded-full">
                  Custom Your Dish
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="category-filter"
              className="font-semibold text-gray-700"
            >
              Filter by Category:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="input input-bordered bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by Title"
              value={searchQuery}
              onChange={handleSearchChange}
              className="input input-bordered bg-white focus:border-green"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green"></div>
          </div>
        ) : items.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            id="order"
          >
            {items.map((item) => (
              <div
                key={item._id}
                className="card bg-white shadow-lg rounded-lg overflow-hidden relative border border-gray-200"
              >
                <div className="relative">
                  <figure>
                    <img
                      src={item.imageUrl}
                      alt={item.recipeName}
                      className="hover:scale-105 transition-all duration-300 md:h-72"
                    />
                  </figure>
                  <div
                    className={`absolute top-2 right-2 p-2 rounded-full ${
                      likedItems[item._id] ? "text-red-500" : "text-gray-500"
                    }`}
                    onClick={() => handleHeartClick(item._id)}
                  >
                    <FaHeart
                      className="w-6 h-6 cursor-pointer"
                      fill={likedItems[item._id] ? "red" : "gray"}
                    />
                  </div>
                </div>
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
                    Add to Cart
                  </button>
                  <Link to={`/menu-item/${item._id}`} className="ml-2">
                    <button className="bg-[#059252] text-white px-4 py-2 rounded-lg hover:bg-[#059212] transition-colors duration-300">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNumber
                        ? "bg-green text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Card;

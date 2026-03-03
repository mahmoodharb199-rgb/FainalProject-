import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Card = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allCategories, setAllCategories] = useState(["all"]);
  const itemsPerPage = 3;

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [currentPage, selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/categories");
      const data = await response.json();
      setAllCategories(["all", ...data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(
        `http://localhost:4000/api/menu-items?${queryParams}`
      );
      const data = await response.json();

      setItems(data.items || []);
      setTotalPages(data.pages || Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
      <div className="p-4" data-aos="fade-up">
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
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="input input-bordered bg-white"
            >
              {allCategories.map((category) => (
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="input input-bordered bg-white focus:border-green"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green"></div>
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {item.recipeName}
                    </h3>
                    <p className="text-green-600 font-bold mb-4">
                      JD{item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  {pageNumbers.map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`px-4 py-2 mx-2 rounded-md ${
                        currentPage === number
                          ? "bg-green text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[400px] text-gray-500">
            No items found
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;

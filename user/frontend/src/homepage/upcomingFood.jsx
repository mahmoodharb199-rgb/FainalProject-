import { useState, useEffect } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 3;

const UpcomingFood = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [currentPage]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/food-soon?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      setItems(response.data.items);
      setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
      <div className="p-4">
        <h2 className="text-center text-2xl font-bold mb-6">
          Soon In Our Menu
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          data-aos="fade-up"
        >
          {items.map((item) => (
            <div
              key={item._id}
              className="card bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
            >
              <figure>
                <img
                  src={item.imageUrl}
                  alt={item.recipeName}
                  className="hover:scale-105 transition-all duration-300 md:h-72 w-full object-cover"
                />
              </figure>
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
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingFood;

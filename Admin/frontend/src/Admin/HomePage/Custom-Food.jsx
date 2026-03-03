import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import { ChevronUp, ChevronDown } from "lucide-react";

function CustomFood() {
  const [customFoods, setCustomFoods] = useState([]);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchCustomFoods();
  }, []);

  const fetchCustomFoods = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/custom-foods"
      );
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid data format received");
      }
      setCustomFoods(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching custom foods:", error);
      setCustomFoods([]);
      setError(
        error.message || "An error occurred while fetching custom foods"
      );
    }
  };

  const handleToggleApproval = async (id, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/custom-foods/toggle-approval/${id}`
      );

      Swal.fire({
        title: "Success!",
        text: `Custom food ${
          currentStatus ? "rejected" : "approved"
        } successfully.`,
        icon: "success",
        confirmButtonText: "OK",
      });

      fetchCustomFoods();
    } catch (error) {
      console.error("Error toggling approval:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update approval status.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSetPrice = async (id) => {
    const { value: price } = await Swal.fire({
      title: "Set price",
      input: "number",
      inputLabel: "Price",
      inputPlaceholder: "Enter the price",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || value < 0) {
          return "Please enter a valid non-negative number";
        }
      },
    });

    if (price) {
      try {
        await axios.put(
          `http://localhost:5000/api/custom-foods/set-price/${id}`,
          { price: parseFloat(price) }
        );

        Swal.fire({
          title: "Success!",
          text: "Price updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });

        fetchCustomFoods();
      } catch (error) {
        console.error("Error setting price:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update price.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleViewNotes = (notes, foodName) => {
    Swal.fire({
      title: `Notes for ${foodName}`,
      text: notes || "No notes available",
      confirmButtonText: "Close",
      width: "50em",
      customClass: {
        text: "text-left",
      },
    });
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = (items) => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedFoods = getSortedItems(customFoods);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFoods.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedFoods.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">
          Custom <span className="text-green">Foods</span>
        </h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("name")}
                  >
                    Name{" "}
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="inline" />
                      ) : (
                        <ChevronDown className="inline" />
                      ))}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("isApproved")}
                  >
                    Status{" "}
                    {sortConfig.key === "isApproved" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="inline" />
                      ) : (
                        <ChevronDown className="inline" />
                      ))}
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("price")}
                  >
                    Price{" "}
                    {sortConfig.key === "price" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="inline" />
                      ) : (
                        <ChevronDown className="inline" />
                      ))}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Set Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((food) => (
                  <tr key={food._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {food.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <div
                          className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap"
                          title={food.notes}
                        >
                          {food.notes}
                        </div>
                        <button
                          onClick={() => handleViewNotes(food.notes, food.name)}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                        >
                          View Notes
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {food.image && (
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          food.isApproved
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {food.isApproved ? "Approved" : "Not Approved"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      JD{food.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div
                        className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap"
                        title={food.user ? food.user.name : "Unknown"}
                      >
                        {food.user ? food.user.name : "Unknown"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div
                        className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap"
                        title={food.user ? food.user.email : "Unknown"}
                      >
                        {food.user ? food.user.email : "Unknown"}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleSetPrice(food._id)}
                        className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-xs"
                      >
                        Set Price
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleToggleApproval(food._id, food.isApproved)
                          }
                          className={`px-3 py-1 rounded ${
                            food.isApproved
                              ? "bg-red hover:bg-red"
                              : "bg-green hover:bg-green"
                          } text-white text-xs`}
                        >
                          {food.isApproved ? "Reject" : "Approve"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomFood;

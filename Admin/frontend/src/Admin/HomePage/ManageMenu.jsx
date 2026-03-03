import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import { Pencil, Trash2, Search, X } from "lucide-react";
import EditMenuItemModal from "./EditMenuItemModal";

const ITEMS_PER_PAGE = 5;

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  const fetchMenuItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/menu-items`, {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchTerm,
        },
      });
      setMenuItems(response.data.items);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      Swal.fire("Error", "Failed to fetch menu items", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchMenuItems();
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchMenuItems]);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / ITEMS_PER_PAGE),
    [totalItems]
  );

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handleDelete = async (id) => {
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
        await axios.delete(`http://localhost:5000/api/menu-items/${id}`);
        Swal.fire("Deleted!", "Item deleted successfully.", "success");
        fetchMenuItems();
      } catch (error) {
        console.error("Error deleting menu item:", error);
        Swal.fire("Error", "Failed to delete the item", "error");
      }
    }
  };

  const handleEdit = useCallback((item) => {
    setCurrentEditItem(item);
    setIsEditModalOpen(true);
  }, []);

  const handleUpdate = async (updatedItem) => {
    try {
      await axios.put(
        `http://localhost:5000/api/menu-items/${updatedItem._id}`,
        updatedItem
      );
      fetchMenuItems();
      setIsEditModalOpen(false);
      Swal.fire("Success", "Item updated successfully", "success");
    } catch (error) {
      console.error("Error updating menu item:", error);
      Swal.fire("Error", "Failed to update the item", "error");
    }
  };

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-grow p-6 md:ml-2">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">
              Manage All <span className="text-green">Menu Items!</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by item name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green w-64"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <p className="text-gray-600">Total Items: {totalItems}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-green text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      Item Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium">
                      Price
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium">
                      Update
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No items found
                      </td>
                    </tr>
                  ) : (
                    menuItems.map((item, index) => (
                      <tr
                        key={item._id}
                        className={index % 2 === 0 ? "bg-gray-50" : ""}
                      >
                        <td className="px-6 py-4">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <img
                            src={item.imageUrl}
                            alt={item.recipeName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </td>
                        <td className="px-6 py-4">{item.recipeName}</td>
                        <td className="px-6 py-4">
                          JD {item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-white hover:text-black bg-green p-2 rounded transition duration-200"
                          >
                            <Pencil size={20} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red hover:text-red transition duration-200"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-green text-white rounded hover:bg-black transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <span className="text-green font-bold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-green text-white rounded hover:bg-black transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <EditMenuItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={currentEditItem}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default ManageMenu;

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";
import { Pencil, Trash2 } from "lucide-react";
import EditMenuItemModal from "./EditFoodSoonModal";

const ITEMS_PER_PAGE = 5;

const ManageFoodSoon = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, [currentPage]);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/food-soon?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      setMenuItems(response.data.items);
      setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching menu items:", error);
      Swal.fire("Error", "Failed to fetch menu items", "error");
    }
  };

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
        await axios.delete(`http://localhost:5000/api/food-soon/${id}`);
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
        fetchMenuItems();
      } catch (error) {
        console.error("Error deleting menu item:", error);
        Swal.fire("Error", "Failed to delete the item", "error");
      }
    }
  };

  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedItem) => {
    setMenuItems(
      menuItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-grow p-6 md:ml-2">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">
            Manage All <span className="text-green">Food Soon Items!</span>
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Image</th>
                  <th className="px-4 py-2 text-left">Item Name</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-center">Update</th>
                  <th className="px-4 py-2 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-4 py-2">
                      <img
                        src={item.imageUrl}
                        alt={item.recipeName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-2">{item.recipeName}</td>
                    <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-white hover:text-black bg-green p-2 rounded"
                      >
                        <Pencil size={20} />
                      </button>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red hover:text-red"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-green text-white rounded hover:bg-black"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-green text-white rounded hover:bg-black"
            >
              Next
            </button>
          </div>
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

export default ManageFoodSoon;

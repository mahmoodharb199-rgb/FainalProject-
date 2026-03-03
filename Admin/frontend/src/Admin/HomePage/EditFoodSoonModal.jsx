import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const EditMenuItemModal = ({ isOpen, onClose, item, onUpdate }) => {
  const [editedItem, setEditedItem] = useState(item || {});

  useEffect(() => {
    setEditedItem(item || {});
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/food-soon/${editedItem._id}`,
        editedItem
      );
      onUpdate(response.data);
      onClose();
      Swal.fire("Success", "Menu item updated successfully", "success");
    } catch (error) {
      console.error("Error updating menu item:", error);
      Swal.fire("Error", "Failed to update menu item", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Menu Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="recipeName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipe Name
            </label>
            <input
              type="text"
              id="recipeName"
              name="recipeName"
              value={editedItem.recipeName || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={editedItem.category || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={editedItem.price || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="recipeDetails"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Recipe Details
            </label>
            <textarea
              id="recipeDetails"
              name="recipeDetails"
              value={editedItem.recipeDetails || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="imageUrl"
              className="block bg-white  text-sm font-medium text-gray-700 mb-1"
            >
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={editedItem.imageUrl || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green text-white rounded hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItemModal;

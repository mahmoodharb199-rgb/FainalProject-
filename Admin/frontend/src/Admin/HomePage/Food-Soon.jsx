import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";

const FoodSoon = () => {
  const [recipeName, setRecipeName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [recipeDetails, setRecipeDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/food-soon", {
        recipeName,
        category,
        price: parseFloat(price),
        recipeDetails,
        imageUrl,
      });
      console.log("Menu item created:", response.data);
      Swal.fire({
        title: "Success!",
        text: "Menu item has been added successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      setRecipeName("");
      setCategory("");
      setPrice("");
      setRecipeDetails("");
      setImageUrl("");
    } catch (error) {
      console.error("Error creating menu item:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add menu item",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-grow p-6 md:ml-5 pt-12">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md ">
          <h1 className="text-3xl font-bold mb-6 ">
            Upload A New <span className="text-green">Menu Item</span>
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="recipeName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Recipe Name*
              </label>
              <input
                type="text"
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green bg-white"
                placeholder="Recipe Name"
                required
              />
            </div>
            <div className="flex mb-4 space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category*
                </label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green bg-white"
                  placeholder="Enter category"
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price*
                </label>
                <input
                  type="text"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green bg-white"
                  placeholder="Price"
                  required
                />
              </div>
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
                value={recipeDetails}
                onChange={(e) => setRecipeDetails(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green bg-white"
                rows="4"
                placeholder="Recipe Details"
              ></textarea>
            </div>
            <div className="mb-6">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green bg-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-black bg-green focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
            >
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FoodSoon;

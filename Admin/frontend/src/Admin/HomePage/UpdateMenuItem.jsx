import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateMenuItem() {
  const [item, setItem] = useState({
    recipeName: "",
    category: "",
    price: "",
    recipeDetails: "",
    imageUrl: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuItem();
  }, [id]);

  const fetchMenuItem = async () => {
    try {
      const response = await axios.get(`/api/menu-items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error("Error fetching menu item:", error);
    }
  };

  const handleInputChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/menu-items/${id}`, item);
      navigate("/manage-items");
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  return (
    <div>
      <h2>Update Menu Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="recipeName"
          value={item.recipeName}
          onChange={handleInputChange}
          placeholder="Recipe Name"
        />
        <input
          type="text"
          name="category"
          value={item.category}
          onChange={handleInputChange}
          placeholder="Category"
        />
        <input
          type="number"
          name="price"
          value={item.price}
          onChange={handleInputChange}
          placeholder="Price"
        />
        <textarea
          name="recipeDetails"
          value={item.recipeDetails}
          onChange={handleInputChange}
          placeholder="Recipe Details"
        />
        <input
          type="text"
          name="imageUrl"
          value={item.imageUrl}
          onChange={handleInputChange}
          placeholder="Image URL"
        />
        <button type="submit">Update Item</button>
      </form>
    </div>
  );
}

export default UpdateMenuItem;

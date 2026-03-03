import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import CommentSection from "./CommentSection";

const MenuItemDetails = () => {
  const [item, setItem] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/menu-items/${id}`
        );
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching menu item:", error);
      }
    };
    fetchItem();
  }, [id]);

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative h-96 md:h-full">
                <img
                  src={item.imageUrl}
                  alt={item.recipeName}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300 hover:scale-105"
                  loading="eager"
                />
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-900">
                  {item.recipeName}
                </h1>
                <div className="inline-block px-4 py-2 bg-green-50 rounded-full">
                  <span className="text-green-700">{item.category}</span>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {item.recipeDetails}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-green-600">
                    JD {item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-gray-50">
            <CommentSection menuItemId={id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MenuItemDetails;

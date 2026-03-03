import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("http://localhost:4000/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setOrders(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching orders:", err);
          setError("Failed to fetch orders. Please try again.");
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 mt-20">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-center">
        Track Your All <span className="text-green">Orders</span>
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-green text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Order Date</th>
              <th className="py-3 px-6 text-left"></th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((order, index) => (
              <tr
                key={order.transactionId}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left">{order.orderDate}</td>
                <td className="py-3 px-6 text-left">{order.transactionId}</td>
                <td className="py-3 px-6 text-left">${order.price}</td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`py-1 px-3 rounded-full text-xs ${
                      order.status === "completed"
                        ? "bg-green"
                        : order.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red"
                    } text-white`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">
                  <button className="text-green hover:text-black">
                    Contact
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default Order;

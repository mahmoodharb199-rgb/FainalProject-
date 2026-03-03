import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Sidebar";

function Orders() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalCommission, setTotalCommission] = useState(0);
  const [driverStatus, setDriverStatus] = useState("available");

  useEffect(() => {
    fetchPayments();
    fetchDriverStatus();
  }, []);

  const fetchDriverStatus = async () => {
    try {
      const token = localStorage.getItem("driverToken");
      const response = await axios.get(
        "http://localhost:4000/api/drivers/driver/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDriverStatus(response.data.status);
    } catch (err) {
      console.error("Error fetching driver status:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("driverToken");
      const response = await axios.get(
        "http://localhost:4000/api/DriveOrder/driver/payments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayments(response.data);
      calculateTotalCommission(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error details:", err.response || err);
      setError(
        "Error fetching payments: " +
          (err.response?.data?.message || err.message)
      );
      setLoading(false);
    }
  };

  const calculateTotalCommission = (paymentsData) => {
    const total = paymentsData.reduce(
      (sum, payment) => sum + payment.amount * 0.05,
      0
    );
    setTotalCommission(total);
  };

  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      const payment = payments.find((p) => p._id === paymentId);
      if (payment.status === "completed" && newStatus === "pending") {
        setError("Cannot change status from completed to pending");
        return;
      }

      const token = localStorage.getItem("driverToken");
      const response = await axios.put(
        `http://localhost:4000/api/DriveOrder/driver/payment/${paymentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedPayments = payments.map((payment) =>
        payment._id === paymentId ? { ...payment, status: newStatus } : payment
      );
      setPayments(updatedPayments);
      calculateTotalCommission(updatedPayments);

      if (response.data.driverStatus) {
        setDriverStatus(response.data.driverStatus);
      }

      fetchDriverStatus();
      setError(null); 
    } catch (err) {
      console.error("Error updating payment status:", err.response || err);
      setError(
        "Error updating payment status: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const viewOrderItems = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <div className="p-10">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold">
              Your <span className="text-green">Orders</span>
            </h1>
          </div>

          {loading && <div className="text-center py-4">Loading...</div>}
          {error && (
            <div className="text-red-500 bg-red-50 p-4 rounded mb-4">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            (payments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders found.</p>
            ) : (
              <>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <strong className="text-lg">
                    Total Delivery Commission: JD {totalCommission.toFixed(2)}
                  </strong>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment ID
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Commission
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment._id} className="hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm">{payment._id}</td>
                          <td className="py-4 px-4 text-sm">
                            {payment.userId?.name || "N/A"}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            JD {payment.amount}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status === "completed"
                                  ? "bg-green text-white"
                                  : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {payment.status.charAt(0).toUpperCase() +
                                payment.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            {payment.deliveryInfo?.address},{" "}
                            {payment.deliveryInfo?.city}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            JD{(payment.amount * 0.05).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <select
                                value={payment.status}
                                onChange={(e) =>
                                  updatePaymentStatus(
                                    payment._id,
                                    e.target.value
                                  )
                                }
                                disabled={payment.status === "completed"}
                                className={`border rounded px-2 py-1 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  payment.status === "completed"
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                              </select>

                              <button
                                onClick={() => viewOrderItems(payment)}
                                className="bg-green hover:bg-green text-white text-sm font-medium py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green"
                              >
                                View Items
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ))}
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-[90%] max-h-[80vh] overflow-y-auto">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.orderSummary.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm text-gray-600 border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">JD{item.price}</p>
                    </div>
                  ))}
                  <div className="pt-3 text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Total: JD{selectedOrder.orderSummary.totalPrice}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    className="w-full bg-green text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
                    onClick={() => setSelectedOrder(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;

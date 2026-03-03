import React, { useState, useEffect } from "react";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "./Sidebar";

const Booking = () => {
  const [payments, setPayments] = useState([]);
  const [expandedPayment, setExpandedPayment] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchPayments();
    fetchAvailableDrivers();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payments");
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const fetchAvailableDrivers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/payments/available-drivers"
      );
      const data = await response.json();
      setAvailableDrivers(data);
    } catch (error) {
      console.error("Error fetching available drivers:", error);
    }
  };

  const handleDeletePayment = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchPayments();
        fetchAvailableDrivers();
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const handleAssignDriver = async (paymentId, driverId) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/payments/assign-driver",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentId, driverId }),
        }
      );
      if (response.ok) {
        fetchPayments();
        fetchAvailableDrivers();
      }
    } catch (error) {
      console.error("Error assigning driver:", error);
    }
  };

  const toggleExpandPayment = (id) => {
    setExpandedPayment(expandedPayment === id ? null : id);
  };

  const filteredPayments = payments.filter((payment) =>
    payment.stripePaymentIntentId
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-grow p-6 pt-20">
        <h1 className="text-3xl font-bold mb-6">
          Manage All <span className="text-green">Orders!</span>
        </h1>

        {/* Search Bar */}
        <div className="mb-4 relative">
          <div className="flex items-center max-w-md border rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search by transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white focus:outline-none"
            />

            <Search className="w-5 h-5 mr-3 text-gray-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Transaction ID</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-left">Assign Driver</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((payment, index) => (
                <React.Fragment key={payment._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-4 px-4">
                      {payment.userId?.name ? payment.userId.name : null}
                    </td>
                    <td className="py-4 px-4">
                      {payment.stripePaymentIntentId}
                    </td>
                    <td className="py-4 px-4">
                      JD {payment.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleExpandPayment(payment._id)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        View{" "}
                        {expandedPayment === payment._id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      {payment.status === "completed" ? (
                        <span className="text-gray-500">
                          {payment.assignedDriver
                            ? payment.assignedDriver.name
                            : "No driver assigned"}
                        </span>
                      ) : payment.assignedDriver ? (
                        <span>{payment.assignedDriver.name}</span>
                      ) : (
                        <select
                          className="border rounded p-1 bg-slate-100"
                          onChange={(e) =>
                            handleAssignDriver(payment._id, e.target.value)
                          }
                        >
                          <option value="">Select Driver</option>
                          {availableDrivers.map((driver) => (
                            <option key={driver._id} value={driver._id}>
                              {driver.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleDeletePayment(payment._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                  {expandedPayment === payment._id && (
                    <tr>
                      <td colSpan="8" className="bg-gray-50 p-4">
                        <h4 className="font-semibold mb-2">Order Summary:</h4>
                        <ul>
                          {payment.orderSummary.items.map((item, idx) => (
                            <li key={idx} className="mb-1">
                              {item.name} - Quantity: {item.quantity} - Price:
                              JD {item.price.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2">
                          <strong>Total Items:</strong>{" "}
                          {payment.orderSummary.itemCount}
                        </p>
                        <p>
                          <strong>Total Price:</strong> JD{" "}
                          {payment.orderSummary.totalPrice.toFixed(2)}
                        </p>
                        {payment.assignedDriver && (
                          <p>
                            <strong>Assigned Driver:</strong>{" "}
                            {payment.assignedDriver.name} (
                            {payment.assignedDriver.email})
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-end items-center mt-4 space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-green-600 hover:text-black disabled:text-gray-300"
            >
              <ChevronLeft size={20} className="mr-1" />
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 text-green-600 hover:text-black disabled:text-gray-300"
            >
              Next
              <ChevronRight size={20} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

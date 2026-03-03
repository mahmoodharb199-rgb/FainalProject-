import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";

export default function Driver() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/drivers");
      setDrivers(response.data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const toggleApproval = async (id, isApproved) => {
    try {
      await axios.put(
        `http://localhost:5000/api/drivers/${id}/toggle-approval`
      );
      fetchDrivers();

      Swal.fire({
        title: isApproved ? "Approval Revoked" : "Driver Approved",
        text: `The driver has been ${isApproved ? "revoked" : "approved"}.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error toggling approval:", error);

      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating the driver status.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 pt-16">
        <h1 className="text-2xl font-bold mb-4">Drivers</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Vehicle Type</th>
              <th className="border p-2 text-left">License Number</th>
              <th className="border p-2 text-left">Approval Status</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id} className="hover:bg-gray-100">
                <td className="border p-2">{driver.name}</td>
                <td className="border p-2">{driver.email}</td>
                <td className="border p-2">{driver.phone}</td>
                <td className="border p-2">{driver.vehicleType}</td>
                <td className="border p-2">{driver.licenseNumber}</td>
                <td className="border p-2">
                  {driver.isApproved ? "Approved" : "Not Approved"}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() =>
                      toggleApproval(driver._id, driver.isApproved)
                    }
                    className={`px-4 py-2 rounded ${
                      driver.isApproved
                        ? "bg-red text-white hover:bg-red"
                        : "bg-green text-white hover:bg-green"
                    }`}
                  >
                    {driver.isApproved ? "Revoke Approval" : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

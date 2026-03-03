import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Sidebar";

const DriverDashboard = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriverData = async () => {
      const driverID = localStorage.getItem("driverID");
      const token = localStorage.getItem("driverToken");

      if (!driverID || !token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:4000/api/drivers/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDriver(response.data);
      } catch (error) {
        console.error("Error fetching driver data:", error);
        localStorage.removeItem("driverID");
        localStorage.removeItem("driverToken");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [navigate]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!driver) return <div className="p-4">No driver data available.</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 p-10 bg-gray-100">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, <span className="text-green">{driver.name}</span>
        </h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-green">Email:</p>
              <p>{driver.email}</p>
            </div>
            <div>
              <p className="font-bold text-green">Phone:</p>
              <p>{driver.phone}</p>
            </div>
            <div>
              <p className="font-bold text-green">Vehicle Type:</p>
              <p>{driver.vehicleType}</p>
            </div>
            <div>
              <p className="font-bold text-green">License Number:</p>
              <p>{driver.licenseNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;

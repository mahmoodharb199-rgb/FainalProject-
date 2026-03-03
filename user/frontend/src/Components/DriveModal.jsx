import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const DriverRequestModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleType: "",
    licenseNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/driver-requests", formData);
      Swal.fire({
        title: "Request Submitted!",
        text: "Your request will be reviewed and we will respond to you.",
        icon: "success",
        confirmButtonText: "OK",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting driver request:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error submitting your request. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Request to be a Driver</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded bg-white"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded bg-white"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded bg-white"
            required
          />
          <input
            type="text"
            name="vehicleType"
            placeholder="Vehicle Type"
            value={formData.vehicleType}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded bg-white"
            required
          />
          <input
            type="text"
            name="licenseNumber"
            placeholder="License Number"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded bg-white"
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverRequestModal;

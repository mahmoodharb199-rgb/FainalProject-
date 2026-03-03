import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Banner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const DriverRequestModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      vehicleType: "",
      licenseNumber: "",
      password: "",
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          "http://localhost:4000/api/driver-requests",
          formData
        );
        console.log("Response:", response.data);
        Swal.fire({
          title: "Request Submitted!",
          text: "Your request will be reviewed and we will respond to you.",
          icon: "success",
          confirmButtonText: "OK",
        });
        onClose();
        setFormData({
          name: "",
          email: "",
          phone: "",
          vehicleType: "",
          licenseNumber: "",
          password: "",
        });
      } catch (error) {
        console.error(
          "Error submitting driver request:",
          error.response ? error.response.data : error.message
        );
        Swal.fire({
          title: "Error!",
          text: `There was an error submitting your request: ${
            error.response ? error.response.data.message : error.message
          }`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
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

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
      <div className="py-24 flex flex-col md:flex-row-reverse items-center justify-between gap-8">
        <div
          className="relative w-full md:w-1/2 mt-7"
          style={{ paddingTop: "30%" }}
        >
          <video
            src="/HeroSection/Banner.mp4"
            alt="Not Found"
            className="absolute top-0 left-0 w-full h-full object-cover"
            loop
            muted
            playsInline
            autoPlay
          >
            <source src="/HeroSection/Banner.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="md:w-1/2 px-4 space-y-7" data-aos="fade-up">
          <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
            Dive into Delights Of Delectable{" "}
            <span className="text-green">Food</span>
          </h2>
          <p className="text-[#4A4A4A] text-xl">
            At Food Ordering Information System, we transform the meal experience by offering customized
            dishes tailored to your specific dietary needs.
          </p>
          <Link to="/Menu">
            <button className="bg-green font-semibold btn text-white px-8 py-3 rounded-full ml-3">
              Order Now
            </button>
          </Link>
          <Link to="/custom">
            <button className="bg-green font-semibold btn text-white px-8 py-3 rounded-full ml-3 mt-5">
              Custom Your Dish
            </button>
          </Link>
          <button
            className="bg-green font-semibold btn text-white px-8 py-3 rounded-full ml-3 mt-5"
            onClick={() => setIsModalOpen(true)}
          >
            Request to be driver
          </button>
        </div>
      </div>

      <DriverRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Banner;

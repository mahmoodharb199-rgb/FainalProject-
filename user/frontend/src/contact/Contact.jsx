import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Star } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function CombinedContactFeedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [activeComponent, setActiveComponent] = useState("contact");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackEntries, setFeedbackEntries] = useState([]);
  const [userFeedback, setUserFeedback] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (isLoggedIn) {
      fetchFeedback();
      fetchUserFeedback();
    }
  }, [isLoggedIn]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/api/contact",
        formData
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Message sent successfully!",
        });

        setFormData({ name: "", email: "", message: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.error || "Something went wrong.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send the message.",
      });
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/feedback");
      if (response.ok) {
        const data = await response.json();
        setFeedbackEntries(data);
      } else {
        console.error("Failed to fetch feedback");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const fetchUserFeedback = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/feedback/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserFeedback(data);
        if (data) {
          setRating(data.rating);
          setFeedback(data.feedback);
        }
      }
    } catch (error) {
      console.error("Error fetching user feedback:", error);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/feedback", {
        method: userFeedback ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rating, feedback }),
      });
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: userFeedback ? "Feedback Updated!" : "Feedback Submitted!",
          text: userFeedback
            ? "Your feedback has been updated successfully."
            : "Your feedback has been submitted successfully and will be visible once approved.",
          confirmButtonColor: "#3085d6",
        });
        setRating(0);
        setFeedback("");
        fetchUserFeedback();
        fetchFeedback();
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message || "Failed to submit feedback. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-6 mt-28">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-8">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setActiveComponent("contact")}
              className={`px-6 py-2 rounded-lg ${
                activeComponent === "contact"
                  ? "bg-green text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Contact Us
            </button>
            {isLoggedIn && (
              <button
                onClick={() => setActiveComponent("feedback")}
                className={`px-6 py-2 rounded-lg ${
                  activeComponent === "feedback"
                    ? "bg-green text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Feedback
              </button>
            )}
          </div>

          {activeComponent === "contact" ? (
            <>
              {/* <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Contact Us
              </h1> */}
              <p className="text-gray-600 mb-8 text-center">
                We'd love to hear from you! Please fill out the form below to
                get in touch with us.
              </p>

              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green sm:text-sm bg-white"
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green sm:text-sm bg-white"
                    placeholder="Your Email"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green sm:text-sm bg-white"
                    placeholder="Your Message"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green text-white py-3 px-6 rounded-lg shadow-md hover:bg-black focus:outline-none focus:ring-2"
                >
                  Send Message
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6">Feedback Page</h1>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  {userFeedback
                    ? "Update Your Feedback"
                    : "Provide Your Feedback"}
                </h2>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Rating
                    </label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={24}
                          onClick={() => setRating(star)}
                          fill={star <= rating ? "gold" : "none"}
                          stroke={star <= rating ? "gold" : "currentColor"}
                          className="cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="feedback"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Feedback
                    </label>
                    <textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 bg-white text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="4"
                      placeholder="Enter your feedback here"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green text-white py-3 px-6 rounded-lg shadow-md hover:bg-black focus:outline-none focus:ring-2"
                  >
                    {userFeedback ? "Update Feedback" : "Submit Feedback"}
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Approved Feedback Entries
                </h2>
                {feedbackEntries.length > 0 ? (
                  <ul className="space-y-4">
                    {feedbackEntries.map((entry) => (
                      <li key={entry._id} className="border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                fill={star <= entry.rating ? "gold" : "none"}
                                stroke={
                                  star <= entry.rating ? "gold" : "currentColor"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{entry.feedback}</p>
                        <p className="text-sm text-gray-500">
                          By: {entry.userId?.name ? entry.userId.name : null}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No approved feedback entries yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

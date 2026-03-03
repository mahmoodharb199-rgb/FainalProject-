import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback");
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch feedback. Please try again later.",
      });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/feedback/${id}`, {
        isApproved: newStatus,
      });
      fetchFeedbacks();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Feedback ${newStatus ? "restored" : "deleted"} successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating feedback status:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update feedback status. Please try again.",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 ">
          <div className="container mx-auto px-6 py-20 ">
            <h1 className="text-3xl font-bold text-gray-700 mb-6">Feedback </h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Username
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Image
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rating
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Feedback
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {feedbacks.map((feedback) => (
                      <tr key={feedback._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.userId?.name ? feedback.userId.name : null}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <img
                            className="rounded-full w-10 h-10"
                            src={
                              feedback.userId?.image
                                ? feedback.userId.image
                                : null
                            }
                            alt="User Image"
                          />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.rating}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.feedback}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              feedback.isApproved
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {feedback.isApproved ? "Approved" : "Deleted"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {feedback.isApproved ? (
                            <button
                              onClick={() =>
                                handleStatusChange(feedback._id, false)
                              }
                              className="bg-red hover:bg-red text-white font-bold py-1 px-3 rounded text-xs"
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleStatusChange(feedback._id, true)
                              }
                              className="bg-green hover:bg-green text-white font-bold py-1 px-3 rounded text-xs"
                            >
                              Restore
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Feedback;

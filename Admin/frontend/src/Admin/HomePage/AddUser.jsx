import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 5;

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const toggleUserStatus = async (userId, currentStatus, userName) => {
    const newStatus = !currentStatus;
    const statusText = newStatus ? "Active" : "Inactive";

    try {
      const result = await Swal.fire({
        title: "Confirm Status Change",
        text: `Are you sure you want to change ${userName}'s status to ${statusText}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await axios.put(
          `http://localhost:5000/api/users/toggle-status/${userId}`,
          {
            isActive: newStatus,
          }
        );
        await fetchUsers();
        Swal.fire(
          "Changed!",
          `${userName}'s status has been changed to ${statusText}.`,
          "success"
        );
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      Swal.fire(
        "Error!",
        "An error occurred while changing the user status.",
        "error"
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="flex-grow p-6 md:ml-5 pt-14">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">All Users</h2>
          <p className="text-gray-600">Total Users: {users.length}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-green text-white">
              <tr>
                <th className="py-3 px-5 text-left border-b">#</th>
                <th className="py-3 px-5 text-left border-b">Name</th>
                <th className="py-3 px-5 text-left border-b">Email</th>
                <th className="py-3 px-5 text-left border-b">Status</th>
                <th className="py-3 px-5 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="py-3 px-5 border-b">
                    {startIndex + index + 1}
                  </td>
                  <td className="py-3 px-5 border-b">{user.name}</td>
                  <td className="py-3 px-5 border-b">{user.email}</td>
                  <td className="py-3 px-5 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        user.isActive
                          ? "bg-green text-white"
                          : "bg-red text-white"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-5 border-b">
                    <button
                      onClick={() =>
                        toggleUserStatus(user._id, user.isActive, user.name)
                      }
                      className={`mr-2 px-3 py-1 rounded ${
                        user.isActive
                          ? "bg-green text-white"
                          : "bg-red text-white"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green text-white rounded hover:bg-black"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green text-white rounded hover:bg-black"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;

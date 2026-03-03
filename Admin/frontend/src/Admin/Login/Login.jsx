import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.message === "Logged in successfully") {
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="pt-10 login w-full h-full">
      <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20 rounded">
        <div className="modal-action flex flex-col justify-center mt-20">
          <form className="card-body" onSubmit={handleSubmit}>
            <h3 className="font-bold text-lg">Please Login!</h3>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-red-500 mt-2">{error}</div>}

            <div className="form-control mt-4">
              <button type="submit" className="btn bg-green text-white">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

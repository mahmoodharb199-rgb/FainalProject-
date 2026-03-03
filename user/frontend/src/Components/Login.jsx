import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
const GOOGLE_CLIENT_ID =
  "392625557509-tf2eg32v4abcpskf8r79fh5ljv1cgn5d.apps.googleusercontent.com";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState("user");
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setIsGoogleScriptLoaded(true);
        };
        document.body.appendChild(script);
      } else {
        setIsGoogleScriptLoaded(true);
      }
    };
    loadGoogleScript();
  }, []);

  useEffect(() => {
    if (isGoogleScriptLoaded && GOOGLE_CLIENT_ID) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleLoginButton"),
          { theme: "outline", size: "large", width: "100%" }
        );
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
        setError("Failed to initialize Google Sign-In");
      }
    }
  }, [isGoogleScriptLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (loginType === "user") {
        const response = await axios.post(
          "http://localhost:4000/api/users/login",
          { email, password },
          { withCredentials: true }
        );

        if (response.status === 200) {
          localStorage.setItem("userID", response.data.userID);
          localStorage.setItem("token", response.data.token);
          navigate("/");
        }
      } else {
        const response = await axios.post(
          "http://localhost:4000/api/drivers/login",
          { email, password }
        );

        if (response.status === 200) {
          localStorage.setItem("driverID", response.data.driverID);
          localStorage.setItem("driverToken", response.data.token);
          navigate("/driver-dashboard");
        }
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/google-login",
        {
          credential: response.credential,
        }
      );

      if (res.status === 200) {
        localStorage.setItem("userID", res.data.userID);
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error logging in with Google");
    }
  };

  return (
    <div className="pt-10 login">
      <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20 rounded">
        <div className="modal-action flex flex-col justify-center mt-0 w-full px-8 py-6">
          <Link
            to="/"
            className="text-3xl font-bold text-green text-center mb-6 hover:underline"
          >
            Food Ordering Information System
          </Link>

          <h3 className="font-bold text-lg text-center mb-6">Please Login!</h3>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setLoginType("user")}
              className={`btn ${
                loginType === "user" ? "bg-green text-white" : "btn-outline"
              }`}
            >
              Login as User
            </button>
            <button
              onClick={() => setLoginType("driver")}
              className={`btn ${
                loginType === "driver"
                  ? "bg-[#059212] text-white"
                  : "btn-outline"
              }`}
            >
              Login as Driver
            </button>
          </div>

          <form onSubmit={handleSubmit}>
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

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                className="input input-bordered bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {" "}
                {showPassword ? "hide password" : "Show password"}{" "}
              </span>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn ${
                  loginType === "user" ? "bg-green" : "bg-[#059212]"
                } text-white`}
              >
                Login as {loginType === "user" ? "User" : "Driver"}
              </button>
            </div>
          </form>

          {loginType === "user" && (
            <p className="text-center my-4">
              Don't have an account?
              <Link
                to="/register"
                className="text-green-500 ml-1 hover:underline"
              >
                Register Now
              </Link>
            </p>
          )}

          {loginType === "user" && (
            <div className="mt-4">
              <div id="googleLoginButton"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

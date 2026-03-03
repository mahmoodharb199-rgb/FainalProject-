import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleSignInScript = () => {
      if (!document.getElementById("google-signin-script")) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.id = "google-signin-script";
        document.body.appendChild(script);
      }
    };

    loadGoogleSignInScript();

    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            "392625557509-tf2eg32v4abcpskf8r79fh5ljv1cgn5d.apps.googleusercontent.com",
          callback: handleGoogleSignup,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large" }
        );
      } else {
        setTimeout(initializeGoogle, 100);
      }
    };

    window.setTimeout(initializeGoogle, 500);
  }, []);

  const handleGoogleSignup = async (response) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/google-signup",
        { credential: response.credential },
        { withCredentials: true }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data.userID) {
        localStorage.setItem("userID", res.data.userID);
        navigate("/");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      setError(error.response?.data?.message || "Error during Google signup");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/register",
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        localStorage.setItem("userID", response.data.userID);
        localStorage.setItem("token", response.data.token);
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="pt-10 login">
      <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20 rounded">
        <div className="modal-action flex flex-col justify-center mt-0 w-full px-8 py-6">
          <h3 className="font-bold text-2xl text-center mb-6">
            Create An Account!
          </h3>

          {/* Regular signup form */}
          <form onSubmit={handleRegister}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="input input-bordered bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-control mt-4">
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
                type="password"
                placeholder="password"
                className="input input-bordered bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="form-control mt-6">
              <button type="submit" className="btn bg-green text-white">
                Register
              </button>
            </div>
          </form>

          {/* Google Sign-in Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or register with
                </span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <div className="mt-4 flex justify-center">
              <div id="google-signin-button"></div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 text-center text-red-500 text-sm">
                {error}
              </div>
            )}
          </div>

          <p className="text-center my-4">
            Have an account?
            <Link to="/login">
              <span className="text-green-500 ml-1 hover:underline">Login</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

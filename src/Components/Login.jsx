import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!");
      setTimeout(() => navigate("/cohorts"), 1000);
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Google Login success
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google user:", decoded);

      // Save to localStorage (optional)
      localStorage.setItem("googleUser", JSON.stringify(decoded));

      toast.success("Google login successful!");
      setTimeout(() => navigate("/join"), 1000);
    } catch (err) {
      console.error("Google login decode error:", err);
      toast.error(" Failed to process Google login.");
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <section className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Left Image Section */}
        <article className="hidden md:block w-1/2">
          <figure className="h-full">
            <img
              src="/tech-bg.png"
              alt="tech background"
              className="object-cover w-full h-full"
            />
          </figure>
        </article>

        {/* Login Form */}
        <div className="flex items-center justify-center w-full md:w-1/2 p-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Sign In
            </h2>

            {/* Email/Password Login */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <span className="ml-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span className="ml-2">Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google login failed!")}
              />
            </div>

            <div className="flex space-x-2 items-center justify-center mt-6 text-sm">
              <p>Don't have an account?</p>
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 font-medium hover:underline"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;

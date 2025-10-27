import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Send OTP
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setOtpSent(true);
      toast.success(" OTP sent! Check your email.");
    } catch (error) {
      console.error("Send OTP Error:", error);
      toast.error(` ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  // Step 2: Verify OTP
  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      localStorage.setItem("token", data.token);
      toast.success("🎉 Registration successful!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Verify OTP Error:", error);
      toast.error(` ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  // Google Register handler
  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const googleUser = {
        name: decoded.name,
        email: decoded.email,
        googleId: decoded.sub,
        avatar: decoded.picture,
      };
      const res = await fetch(`${apiUrl}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleUser),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Google registration failed");

      localStorage.setItem("token", data.token);
      toast.success(" Google registration successful!");
      setTimeout(() => navigate("/join"), 1000);
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error(" Google signup failed. Try again.");
    }
  };
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <section className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <article className="hidden md:block w-1/2">
          <figure className="h-full">
            <img
              src="/tech-bg.png"
              alt="tech background"
              className="object-cover w-full h-full"
            />
          </figure>
        </article>

        <div className="flex items-center justify-center w-full md:w-1/2 p-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Create Account
            </h2>

            {!otpSent ? (
              <form onSubmit={sendOTP} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition"
                >
                  {loading ? "Sending OTP..." : "Register"}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOTP} className="space-y-4">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            {/* Google Register */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleRegister}
                onError={() => toast.error("Google Signup Failed")}
              />
            </div>
            <p className="text-sm text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-pink-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;

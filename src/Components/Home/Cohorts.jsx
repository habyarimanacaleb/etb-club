import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cohorts = () => {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCohorts = async () => {
     const token = localStorage.getItem("token");
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await axios.get(`${apiUrl}/api/cohort-inform`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
        });
        console.log("Cohorts API response:", res.data);
        setCohorts(res.data.cohorts || []);
      } catch (err) {
        console.error("Error fetching cohorts:", err);
        setError("Failed to load cohorts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCohorts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 animate-spin border-3 rounded-full border-blue-200 mr-5"></div>
        <p className="text-gray-500 text-lg">Please wait cohorts are loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (cohorts.length === 0) {
    return (
      <div className="flex justify-center flex-col items-center mt-40 lg:mt-80">
        <p className="text-gray-500 text-lg">No cohorts available at the moment.</p>
      </div>
    );
  }

  return (
   <div className="p-4 min-h-screen bg-gray-50">
  <h1 className="text-3xl font-medium my-12 text-center text-gray-600">Available Cohorts</h1>
  <ul className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {cohorts.map((cohort, index) => (
      <li
        key={cohort._id}
        className="border rounded-lg shadow hover:shadow-xl transition bg-white flex flex-col justify-between hover:scale-105 mx-4 md:mx-0 mb-2"
      >
        <div>
          <div className="w-full text-6xl font-bold text-gray-300 animate-pulse h-52 mt-2 mb-4 overflow-hidden bg-gray-200 flex items-center justify-center">
            00{index + 1}
          </div>
          <div className="p-6">
          <h2 className="font-bold text-2xl text-blue-500">{cohort.name}</h2>
          <p className="text-gray-600 text-lg font-semibold mb-4">{cohort.program}</p>
          <p className="text-gray-500 text-sm italic">
            {new Date(cohort.startDate).toLocaleDateString()} -{" "}
            {new Date(cohort.endDate).toLocaleDateString()}
          </p>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent li click
            navigate(`/cohorts/${cohort._id}`);
          }}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-700 cursor-pointer text-white py-3 rounded-xl font-semibold transition"
        >
          Enroll Now
        </button>
          </div>
        </div>

      </li>
    ))}
  </ul>
</div>

  );
};

export default Cohorts;

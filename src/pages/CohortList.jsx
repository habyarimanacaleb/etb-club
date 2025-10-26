import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Join from "../Components/Join";
import toast, { Toaster } from "react-hot-toast";

const JoinCohort = () => {
  const { id } = useParams();
  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId"); // save user id when login
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch cohort details
  useEffect(() => {
    const fetchCohort = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/cohort-inform/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCohort(res.data.cohort || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cohort details");
      } finally {
        setLoading(false);
      }
    };
    fetchCohort();
  }, [id]);

  // Handle Join Cohort
  const handleJoin = async () => {
    if (!cohort) return;
    if (cohort.students.some((s) => s._id === currentUserId)) {
      toast.error("You have already joined this cohort");
      return;
    }

    setJoining(true);
    try {
      const res = await axios.post(
        `${apiUrl}/api/cohort-inform/assign`,
        { cohortId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Successfully joined the cohort!");
      // Refresh cohort details
      const updated = await axios.get(`${apiUrl}/api/cohort-inform/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCohort(updated.data.cohort);

      setTimeout(() => {
        toast.dismiss();
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to join cohort");
    } finally {
      setJoining(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 animate-spin border-3 rounded-full border-blue-400 mr-5"></div>
        <p className="text-gray-500 text-lg">Loading cohort details...</p>
      </div>
    );

  if (!cohort)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">Cohort not found</p>
      </div>
    );

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-12 justify-items-center bg-gradient-to-r from-purple-600 to-pink-500">
      {/* Header */}

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Complete Your Application
        </h2>
        <Join cohortId={id} />
      </div>

      {/* Cohort details */}
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-3xl h-[500px]">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{cohort.name}</h1>
        <p className="text-gray-600 mb-4">{cohort.description}</p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Program:</span> {cohort.program}
        </p>
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Dates:</span>{" "}
          {new Date(cohort.startDate).toLocaleDateString()} -{" "}
          {new Date(cohort.endDate).toLocaleDateString()}
        </p>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Students Joined:
          </h2>
          {cohort.students.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-700 max-h-40 overflow-y-auto">
              {cohort.students.map((student) => (
                <li key={student._id}>
                  {student.name} ({student.email})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No students have joined yet.</p>
          )}
        </div>

        {message && (
          <p className="text-center text-green-600 font-semibold mb-4">
            {message}
          </p>
        )}

        <button
          onClick={handleJoin}
          disabled={
            joining || cohort.students.some((s) => s._id === currentUserId)
          }
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            joining
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {joining
            ? "Joining..."
            : cohort.students.some((s) => s._id === currentUserId)
            ? "Already Joined"
            : "Join Cohort"}
        </button>
      </div>
    </div>
    </>
  );
};

export default JoinCohort;

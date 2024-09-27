"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import edit from "../../../../public/icons/edit.svg";
import del from "../../../../public/icons/delete.svg";

export default function JobSeekersTable() {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSeeker, setSelectedSeeker] = useState(null);

  const fetchJobSeekers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employe-users`,
        { headers: { "Cache-Control": "no-store" } }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setJobSeekers(data);
    } catch (error) {
      setError(error.message);
      console.error("Failed to fetch job seekers:", error);
    }
  };

  useEffect(() => {
    fetchJobSeekers();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/update-user-status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, status: newStatus }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      setJobSeekers((prev) =>
        prev.map((seeker) =>
          seeker._id === userId ? { ...seeker, status: newStatus } : seeker
        )
      );
    } catch (error) {
      setError("Failed to update user status.");
      console.error("Failed to update user status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (seeker) => {
    setSelectedSeeker(seeker);
    setEditModalOpen(true);
  };

  const handleDeleteClick = async (userId) => {
    if (confirm("Are you sure you want to delete this job seeker?")) {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/delete-user/${userId}`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        setJobSeekers((prev) => prev.filter((seeker) => seeker._id !== userId));
      } catch (error) {
        alert("Failed to delete user: " + error.message);
        console.error("Failed to delete user:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="md:p-5 p-2 bg-white shadow-md rounded-lg md:w-[70%] w-[100%] m-0 md:m-5">
      <h1 className="md:text-base text-center font-bold text-[#5C5C5C] mb-5">
        Employer
      </h1>

      <div className="flex flex-col md:space-y-2 space-y-2">
        <div className="flex gap-1 mb-2 md:p-3 p-0 font-semibold">
          {["Date", "User ID", "User Name", "User Email", "Job Post", "Status", "Action"].map(
            (header, index) => (
              <div
                key={index}
                className="w-1/6 text-[#858585] md:text-xs text-center text-[10px] leading-3 md:leading-5 font-semibold"
              >
                {header}
              </div>
            )
          )}
        </div>

        {jobSeekers.length > 0 ? (
          jobSeekers.map((seeker) => (
            <div
              key={seeker._id}
              className="flex gap-3 justify-center md:p-3 px-4 border border-[#F0F0F0] rounded-md bg-white h-10 md:h-16 items-center"
            >
              <div className="w-1/6 text-xs font-normal text-center text-[#858585]">14/01/2019</div>
              <div className="w-1/6 text-xs font-normal text-center text-[#858585]">
                {seeker._id.slice(0, 7)}
              </div>
              <div className="w-1/6 text-xs font-normal text-center text-[#858585]">
                {seeker.userName}
              </div>
              <div className="w-1/6 text-xs font-normal text-center text-[#858585] relative group">
                <span>
                  {seeker.email.length > 8 ? `${seeker.email.slice(0, 8)}...` : seeker.email}
                </span>
                <div className="absolute left-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-1 z-10 w-max">
                  {seeker.email}
                </div>
              </div>
              <div className="w-1/6 text-xs font-normal text-center text-[#858585]">
                {seeker.totalJobPosted}
              </div>
              <div className="w-1/6">
                <select
                  className={`md:px-3 md:py-2 py-1 px-0 rounded-md text-white ${getStatusColor(
                    seeker.status
                  )}`}
                  value={seeker.status}
                  onChange={(e) => handleStatusChange(seeker._id, e.target.value)}
                  disabled={loading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="w-1/6 flex gap-1">
                <button onClick={() => handleEditClick(seeker)}>
                  <Image src={edit} alt="Edit" />
                </button>
                <button onClick={() => handleDeleteClick(seeker._id)}>
                  <Image src={del} alt="Delete" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-[#858585] md:text-xs text-[8px]">
            No job seekers available.
          </div>
        )}
      </div>

      <button className="mt-4 py-2 mx-auto flex md:px-4 bg-[#007DC5] justify-center text-white rounded-md text-xs font-bold w-28 hover:bg-blue-600">
        Load More
      </button>

      {editModalOpen && selectedSeeker && (
        <EditModal
          seeker={selectedSeeker}
          onClose={() => setEditModalOpen(false)}
          onSave={fetchJobSeekers}
        />
      )}
    </div>
  );
}

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-500";
    case "inactive":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

const EditModal = ({ seeker, onClose, onSave }) => {
  const [userName, setUserName] = useState(seeker.userName);
  const [email, setEmail] = useState(seeker.email);
  const [totalJobPosted, setTotalJobPosted] = useState(seeker.totalJobPosted);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/edit/${seeker._id}`, // Use seeker._id here
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName, email, totalJobPosted }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      onSave(); 
      onClose(); 
    } catch (error) {
      alert("Failed to update user: " + error.message);
      console.error("Failed to update user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Job Seeker</h2>

        {/* Display the seeker ID here */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Seeker ID:</label>
          <div className="text-sm font-bold text-gray-900">{seeker._id}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">User Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total Job Posted</label>
            <input
              type="number"
              value={totalJobPosted}
              onChange={(e) => setTotalJobPosted(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-black rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

"use client";
import { useState, useEffect } from "react";
import edit from "../../../../public/icons/edit.svg";
import del from "../../../../public/icons/delete.svg";

import Image from "next/image";

export default function JobSeekersTable() {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(); // Use lowercase for error state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSeeker, setSelectedSeeker] = useState(null); // Store selected job seeker for editing

  async function fetchJobSeekers() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/employe-users`,
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setJobSeekers(data);
    } catch (error) {
      console.error("Failed to fetch job seekers:", error);
      setError(error.message);
    }
  }

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      setJobSeekers((prevJobSeekers) =>
        prevJobSeekers.map((seeker) =>
          seeker._id === userId ? { ...seeker, status: newStatus } : seeker
        )
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (seeker) => {
    setSelectedSeeker(seeker); // Store selected seeker
    setEditModalOpen(true); // Open the edit modal
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/update-user/${seeker._id}`, // Ensure this endpoint is correct
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName, email, totalJobPosted }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      // Re-fetch job seekers
      onSave(); // Call the fetch function passed as a prop
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user: " + error.message); // Show alert on error
    }
  };
  
  const handleDeleteClick = async (userId) => {
    const confirmDelete = confirm("Are you sure you want to delete this job seeker?");
    if (confirmDelete) {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/delete-user/${userId}`, // Ensure this endpoint is correct
          {
            method: "DELETE",
          }
        );
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        // Update the job seekers state
        setJobSeekers((prevJobSeekers) => 
          prevJobSeekers.filter((seeker) => seeker._id !== userId)
        );
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user: " + error.message); // Show alert on error
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <div className="md:p-5 p-2 bg-white shadow-md rounded-lg md:w-[70%] w-[100%] m-0 md:m-5">
      <h1 className="md:text-base text-center font-bold text-[#5C5C5C] mb-5">Employer</h1>

      <div className="flex flex-col md:space-y-2 space-y-2">
        {/* Header Row */}
        <div className="flex gap-1 mb-2 md:p-3 p-0 font-semibold">
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">Date</div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">User ID</div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">User Name</div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">User Email</div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">Job Post</div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">Status</div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">Action</div>
        </div>

        {/* Data Rows */}
        {jobSeekers.length > 0 &&
          jobSeekers.map((seeker, index) => (
            <div
              key={index}
              className="flex md:gap-5 gap-3 justify-center md:p-3 px-4 border border-[#F0F0F0] rounded-md bg-white h-10 md:h-16 items-center"
            >
              <div className="w-1/6 text-[#858585] md:text-xs text-[8px] md:text-left text-center leading-3 md:leading-4 font-normal">14/01/2019</div>
              <div className="w-1/6 text-[#858585] md:text-xs text-[8px] md:text-left text-center leading-3 md:leading-4 font-normal">{seeker._id.slice(0, 7)}</div>
              <div className="w-1/6 text-[#858585] md:text-xs text-[8px] md:text-left text-center leading-3 md:leading-4 font-normal">{seeker.userName}</div>
              <div className="w-1/6 text-[#858585] md:text-xs text-[8px] md:text-left text-center leading-3 md:leading-4 font-normal">
                <div className="relative group">
                  <span>{seeker.email.length > 8 ? seeker.email.slice(0, 8) + "..." : seeker.email}</span>
                  <div className="absolute left-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-1 z-10 w-max">{seeker.email}</div>
                </div>
              </div>
              <div className="w-1/6 text-xs font-normal text-center leading-4 text-[#858585]">{seeker.totalJobPosted}</div>
              <div className="w-1/6 text-[#858585] text-xs text-[10px] font-normal leading-4">
                <select
                  className={`md:px-3 md:py-2 py-1 px-0 rounded-md text-white ${getStatusColor(seeker.status)}`}
                  value={seeker.status}
                  onChange={(e) => handleStatusChange(seeker._id, e.target.value)}
                  disabled={loading}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
              <div className="w-1/6 flex md:gap-4 gap-1">
                <button className="text-yellow-500 hover:text-yellow-700" onClick={() => handleEditClick(seeker)}>
                  <Image src={edit} />
                </button>
                <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteClick(seeker._id)}>
                  <Image src={del} />
                </button>
              </div>
            </div>
          ))}
      </div>

      <button className="mt-4 py-2 mx-auto flex md:px-4 bg-[#007DC5] justify-center text-white rounded-md text-xs font-bold w-28 hover:bg-blue-600">
        Load More
      </button>

      {/* Edit Modal */}
      {editModalOpen && selectedSeeker && (
        <EditModal 
          seeker={selectedSeeker} 
          onClose={() => setEditModalOpen(false)} 
          onSave={fetchJobSeekers} // Re-fetch job seekers after edit
        />
      )}
    </div>
  );
}

// Utility function to get status color
function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-500";
    case "inactive":
      return "bg-red-500";
    case "hired":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}

// EditModal Component
const EditModal = ({ seeker, onClose, onSave }) => {
  const [userName, setUserName] = useState(seeker.userName);
  const [email, setEmail] = useState(seeker.email);
  const [totalJobPosted, setTotalJobPosted] = useState(seeker.totalJobPosted);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement save logic (API call to update user)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/update-user/${seeker._id}`, // Adjust endpoint as necessary
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName, email, totalJobPosted }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      onSave(); // Re-fetch job seekers
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md shadow-md">
        <h2 className="text-lg font-bold">Edit Job Seeker</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">User Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block">Total Job Posted</label>
            <input
              type="number"
              value={totalJobPosted}
              onChange={(e) => setTotalJobPosted(e.target.value)}
              required
              className="border rounded p-2 w-full"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-300 rounded px-4 py-2">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

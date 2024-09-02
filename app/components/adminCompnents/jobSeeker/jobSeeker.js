"use client";

import { useState, useEffect } from "react";
import edit from "../../../../public/icons/edit.svg";
import del from "../../../../public/icons/delete.svg";
import Image from "next/image";

export default function JobSeekersTable() {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchJobSeekers() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/seeker-users`,
        {
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );
      const data = await response.json();
      setJobSeekers(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch job seekers:", error);
      setError(error.message);
      setLoading(false);
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

      // Update the local state to reflect the change in status
      setJobSeekers((prevJobSeekers) =>
        prevJobSeekers.map((seeker) =>
          seeker._id === userId ? { ...seeker, status: newStatus } : seeker
        )
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
      setError("Failed to update user status.");
    } finally {
      setLoading(false);
    }
  };


  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="md:p-5 p-2  bg-white shadow-md rounded-lg md:w-[70%] w-[100%] m-0 md:m-5">
      <h1 className="md:text-base text-center font-bold text-[#5C5C5C] mb-5">Job Seeker</h1>

      <div className="flex flex-col md:space-y-2 space-y-2">
        {/* Header Row */}
        <div className="flex gap-1 mb-2 md:p-3 p-0 font-semibold">
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">
            Date
          </div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">
            User ID
          </div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">
            User Name
          </div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">
            User Email
          </div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">
            Job Applied
          </div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">
            Status
          </div>
          <div className="w-1/6 text-[#858585] md:text-xs md:text-left text-center text-[10px] leading-3 md:leading-5 font-semibold">
            Action
          </div>
        </div>

        {/* Data Rows */}
        {jobSeekers.length > 0 &&
          jobSeekers?.map((seeker, index) => (
            <div
              key={index}
              className="flex md:gap-5 gap-3 justify-center md:p-3  px-4 border border-[#F0F0F0] rounded-md bg-white h-10 md:h-16 items-center"
            >
              <div className="w-1/6 text-[#858585]  md:text-xs text-[8px] md:text-left text-center  leading-3 md:leading-4 font-normal ">
                14/01/2019
              </div>{" "}
              {/* Static Date as in your example */}
              <div className="w-1/6 text-[#858585]  md:text-xs text-[8px] md:text-left text-center  leading-3 md:leading-4 font-normal">
                {seeker._id.slice(0, 7)}
              </div>
              <div className="w-1/6 text-[#858585]  md:text-xs text-[8px] md:text-left text-center  leading-3 md:leading-4 font-normal">
                {seeker.userName}
              </div>
              <div className="w-1/6 text-[#858585]  md:text-xs text-[8px] md:text-left text-center  leading-3 md:leading-4 font-normal">
                <div className="relative group">
                  <span>
                    {seeker.email.length > 8
                      ? seeker.email.slice(0, 8) + "..."
                      : seeker.email} 
                  </span>
                  <div className="absolute left-0 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-1 z-10 w-max">
                    {seeker.email}
                  </div>
                </div>
              </div>
              <div className="w-1/6 text-[#858585] text-center text-xs font-normal leading-4">
                {/* {Math.floor(Math.random() * 15) + 1} */}
                {seeker.jobAppliedCount}
              </div>{" "}
              {/* Random Job Applied */}
              <div className="w-1/6 text-[#858585] text-center text-xs text-[10px] font-normal leading-4">
                <select
                  className={`md:px-3 md:py-2 py-1 px-0 rounded-md text-white ${getStatusColor(
                    seeker.status
                  )}`}
                  value={seeker.status} // The value reflects the current status of the user
                  onChange={(e) =>
                    handleStatusChange(seeker._id, e.target.value)
                  }
                  disabled={loading}
                >
                  {/* Set default value based on the current status */}
                  <option value="active" selected={seeker.status === "active"}>
                    Active
                  </option>
                  <option
                    value="inactive"
                    selected={seeker.status === "inactive"}
                  >
                    Inactive
                  </option>
                </select>
              </div>
              <div className="w-1/6 flex md:gap-4 gap-1">
                <button className="text-yellow-500 hover:text-yellow-700">
                  <Image src={edit} />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <Image src={del} />
                </button>
              </div>
            </div>
          ))}
      </div>

      <button className="mt-4 py-2  mx-auto flex md:px-4 bg-[#007DC5] justify-center text-white rounded-md text-xs font-bold w-28 hover:bg-blue-600">
        Load More
      </button>
    </div>
  );
}

// Utility function to get status color
function getStatusColor(status) {
  if (!status) {
    return "bg-gray-500"; // Default color if status is undefined
  }

  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-500";
    case "inactive":
      return "bg-red-500";
    default:
      return "bg-green-500";
  }
}

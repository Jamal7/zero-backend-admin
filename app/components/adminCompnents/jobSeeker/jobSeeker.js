'use client';

import { useState, useEffect } from 'react';
import edit from '../../../../public/icons/edit.svg';
import del from '../../../../public/icons/delete.svg';
import Image from 'next/image';

export default function JobSeekersTable() {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchJobSeekers() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seeker-users`);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>${process.env.NEXT_PUBLIC_API_URL} Error: {error} </div>;
  }

  return (
    <div className="p-5 bg-white shadow-md rounded-lg w-[70%] m-5">
      <h1 className="text-base font-bold text-[#5C5C5C] mb-5">Job Seeker</h1>
      <h1 className="text-base font-bold text-[#5C5C5C] mb-5">{process.env.NEXTAUTH_URL}</h1>

      <div className="flex flex-col space-y-2">
        {/* Header Row */}
        <div className="flex p-3 font-semibold">
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">Date</div>
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">User ID</div>
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">User Name</div>
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">Job Applied</div>
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">Status</div>
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">Action</div>
        </div>

        {/* Data Rows */}
        {jobSeekers.length > 0 && jobSeekers?.map((seeker, index) => (
          <div key={index} className="flex p-3 border border-[#F0F0F0] rounded-md bg-white h-16 items-center">
            <div className="w-1/6 text-[#858585] text-xs font-normal leading-4">14/01/2019</div> {/* Static Date as in your example */}
            <div className="w-1/6 text-[#858585] text-xs font-normal leading-4">{seeker._id}</div>
            <div className="w-1/6 text-[#858585] text-xs font-normal leading-4">{seeker.email.split('@')[0]}</div> {/* Example username */}
            <div className="w-1/6 text-[#858585] text-xs font-normal leading-4">{Math.floor(Math.random() * 15) + 1}</div> {/* Random Job Applied */}
            <div className="w-1/6 text-[#858585] text-xs font-normal leading-4">
              <span className={`px-3 py-1 rounded-full text-white ${getStatusColor(seeker.status)}`}>
                {seeker.status}
              </span>
            </div>
            <div className="w-1/6 flex gap-4">
            <button className="text-yellow-500 hover:text-yellow-700"><Image src={edit}/></button>
            <button className="text-red-500 hover:text-red-700"><Image src={del}/></button>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 py-2 mx-auto flex px-4 bg-[#007DC5] justify-center text-white rounded-md text-xs font-bold w-28 hover:bg-blue-600">
        Load More
      </button>
    </div>
  );
}

// Utility function to get status color
function getStatusColor(status) {
  if (!status) {
    return 'bg-gray-500'; // Default color if status is undefined
  }

  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-500';
    case 'inactive':
      return 'bg-red-500';
    case 'hired':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
}

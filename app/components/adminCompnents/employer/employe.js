'use client';
import { useState, useEffect } from 'react';
import edit from '../../../../public/icons/edit.svg';
import del from '../../../../public/icons/delete.svg';

import Image from 'next/image';
export default function JobSeekersTable() {
  const [jobSeekers, setJobSeekers] = useState([]);
  async function fetchJobSeekers() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employe-users`, {
        headers: {
          'Cache-Control': 'no-store',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      setJobSeekers(data);
    } catch (error) {
      console.error("Failed to fetch job seekers:", error);
      setError(error.message); // Assuming you have a state to store errors
    }
  }
  
  useEffect(() => {
    fetchJobSeekers();
  }, []);
  

  return (
    <div className="p-5 bg-white shadow-md rounded-lg w-[70%] m-5">
      <h1 className="text-base font-bold text-[#5C5C5C] mb-5">Employee</h1>

      <div className="flex flex-col space-y-2">
        {/* Header Row */}
        <div className="flex p-3 font-semibold">
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">Date</div>
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">User ID</div>
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">User Name</div>
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">User Email</div>

          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">Job Applied</div>
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">Status</div>
          <div className="w-1/6 text-[#858585] text-xs leading-5 font-semibold">Action</div>
        </div>
        
        {/* Data Rows */}
        {jobSeekers.length > 0 && jobSeekers?.map((seeker, index) => (
          <div key={index} className="flex p-3 bg-white border border-[#F0F0F0] rounded-md h-16 items-center">
            <div className="w-1/6 text-xs font-normal leading-4 text-[#858585]">14/01/2019</div> {/* Static Date as in your example */}
            <div className="w-1/6 text-xs font-normal leading-4 text-[#858585]">{seeker._id}</div>
            <div className="w-1/6 text-xs font-normal leading-4 text-[#858585]">{seeker.userName}</div>

            <div className="w-1/6 text-xs font-normal leading-4 text-[#858585]">{seeker.email}</div> {/* Example username */}
            <div className="w-1/6 text-xs font-normal leading-4 text-[#858585]">{Math.floor(Math.random() * 15) + 1}</div> {/* Random Job Applied */}
            <div className="w-1/6 text-xs font-normal leading-4 text-[#858585]">
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
  switch (status?.toLowerCase()) {
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

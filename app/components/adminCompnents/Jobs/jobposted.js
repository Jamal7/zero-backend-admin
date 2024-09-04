import React, { useState, useEffect } from 'react';
import edit from "../../../../public/icons/edit.svg";
import del from "../../../../public/icons/delete.svg";
import messages from "../../../../public/icons/Messages.svg";

import Image from "next/image";

export default function JobPosted() {
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="md:p-10 p-0  bg-white shadow-md rounded-lg w-full md:m-5 m-0 py-3  ">
            <h1 className="text-lg md:ml-2 ml-0 md:text-left text-center font-bold text-[#5C5C5C] mb-5">Job Posted</h1>

            <div className="overflow-x-auto md:px-0 px-1">
                {/* Header Row */}
                <div className="flex flex-row md:py-10 gap-2 py-2 px-3 font-semibold  rounded-t-md">
                    <div className="w-[16.6%] text-[#858585] text-[8px] text-center  md:text-xs md:leading-5 leading-3  font-semibold">Date</div>
                    <div className="w-[16.6%] text-[#858585] text-[8px] text-center md:text-xs md:leading-5 leading-3 font-semibold">Employer ID</div>
                    <div className="w-[16.6%] text-[#858585] text-[8px] text-center md:text-xs md:leading-5 leading-3 font-semibold">Employer Name</div>
                    <div className="w-[16.6%] text-[#858585] text-[8px] text-center md:text-xs md:leading-5 leading-3 font-semibold">User Applied</div>
                    <div className="w-[16.6%] text-[#858585] text-[8px] text-center md:text-xs md:leading-5 leading-3 font-semibold">User Shortlisted</div>
                    <div className="w-1/6 text-[#858585] text-[8px] text-center md:text-xs md:leading-5 leading-3 font-semibold">Action</div>
                </div>

                {/* Data Rows */}
                {jobSeekers.length > 0 &&
                    jobSeekers.map((seeker, index) => (
                        <div
                            key={index}
                            className="flex flex-row md:mb-4 mb-1 sm:justify-evenly p-3 border border-[#F0F0F0] rounded-2xl gap-2 text-center items-center"
                        >


                            <div className="w-[16.6%] text-[#858585] md:text-xs text-[8px] text-xs font-normal leading-4">14/01/2019</div>
                            {/* Static Date as in your example */}
                            <div className="w-[16.6%] text-[#858585] md:text-xs text-[8px] text-xs font-normal leading-4">
                                {seeker._id.slice(0, 7)}
                            </div>
                            <div className="w-[16.6%] text-[#858585] md:text-xs text-[8px] text-xs font-normal leading-4">
                                {seeker.userName}
                            </div>
                            <div className="w-[16.6%] text-[#858585] md:text-xs text-[8px] text-xs font-normal leading-4">
                                {Math.floor(Math.random() * 15) + 1}
                            </div>
                            <div className="w-[16.6%] text-[#858585] md:text-xs text-[8px] text-xs font-normal leading-4">
                                {Math.floor(Math.random() * 15) + 1}
                            </div>
                            <div className="flex items-center gap-0 w-[20%] md:w-auto">
                                <button className="p-1 md:p-2 flex items-center justify-center">
                                    <Image src={messages} alt="Messages" width={20} height={20} />
                                </button>
                                <button className="p-1 md:p-2 text-yellow-500 hover:text-yellow-700 flex items-center justify-center">
                                    <Image src={edit} alt="Edit" width={20} height={20} />
                                </button>
                                <button className="p-1 md:p-2 text-red-500 hover:text-red-700 flex items-center justify-center">
                                    <Image src={del} alt="Delete" width={20} height={20} />
                                </button>
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
            return "bg-gray-500";
    }
}

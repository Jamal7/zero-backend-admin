'use client'
import Image from "next/image";
import SideBar from "../../components/adminCompnents/sidebar/sideBar";
import Topbar from "../../components/adminCompnents/topbar/topbar";
import JobSeeker from "../../components/adminCompnents/jobSeeker/jobSeeker";
import Employer from "../../components/adminCompnents/employer/employe";

import authMiddleware from '../../auth/authMiddleware';

function Users() {
  return (
    <div className="flex">
        <SideBar />
        <div className="flex flex-col w-full">
        <Topbar/>
        <JobSeeker/>
        <Employer/>
        </div>
    </div>
  );
}

export default authMiddleware(Users);


'use client'
import Image from "next/image";
import SideBar from "../../components/adminCompnents/sidebar/sideBar";
import Topbar from "../../components/adminCompnents/topbar/topbar";
import JobSeeker from "../../components/adminCompnents/jobSeeker/jobSeeker";
import Employer from "../../components/adminCompnents/employer/employe";


export default function Users() {
  return (
    <div className="flex">
        <SideBar />
        <div className="flex flex-col w-full">
        <Topbar/>
        <div className="px-5 py-5">
        <JobSeeker/>
        <Employer/>
        </div>   
        </div>
    </div>
  );
}



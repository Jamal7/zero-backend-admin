// src/app/components/AdminClientPage.js
'use client';

import SideBar from "./sidebar/sideBar";
import Topbar from "./topbar/topbar";

export default function AdminClientPage({ session }) {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex flex-col w-full">
        <Topbar />
        <h1>Welcome to Zero admin, {session?.user?.name}!</h1>
      </div>
    </div>
  );
}

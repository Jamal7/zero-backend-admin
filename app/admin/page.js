'use client'
import SideBar from "../components/adminCompnents/sidebar/sideBar";
import Topbar from "../components/adminCompnents/topbar/topbar";
import authMiddleware from '../auth/authMiddleware';

function AdminUsers() {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex flex-col w-full">
        <Topbar />
        <h1>Welcome to the Users Management!</h1>
      </div>
    </div>
  );
}

export default authMiddleware(AdminUsers);  // Wrap your component with the middleware

import Image from "next/image";
import SideBar from "../components/adminCompnents/sidebar/sideBar";
import Topbar from "../components/adminCompnents/topbar/topbar";
export default function Home() {
  return (
    <div className="flex">
        <SideBar />
        <div className="flex flex-col w-full">
        <Topbar/>
      <h1>Welcome to Zero admin!</h1>
        </div>

    </div>
  );
}

// src/app/components/AdminClientPage.js
// 'use client';

import SideBar from "../sidebar/sideBar";
import Topbar from "../topbar/topbar";
import Charts from "../OverView/OverviewComponents/Charts.js";
import BarCharts from "./OverviewComponents/BarChart";

export default function AdminClientPage({ session }) {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex flex-col w-full">
        <Topbar />
        <h1>Welcome to Zero admin, {session?.user?.name}!</h1>
        <div className="flex">
        <Charts
          labelText="Total Number of App Downloads"
          percentage={18}
          changeText="10% ↓"
          changeColor="red"
          color="#3498db"
          textColor="#333"
          filledRatio={0.18} // Custom filled ratio
        />
          <Charts
          labelText="Total Number Job Posted"
          percentage={64}
          changeText="10% ↓"
          changeColor="red"
          color="#75E76B"
          textColor="#333"
          filledRatio={0.64} // Custom filled ratio
        />
          <Charts
          labelText="Total Number Of Users"
          percentage={98}
          changeText="10% ↓"
          changeColor="red"
          color="#79D2DE"
          textColor="#333"
          filledRatio={0.98} // Custom filled ratio
        />
        </div>
        <BarCharts />
      </div>
    </div>
  );
}

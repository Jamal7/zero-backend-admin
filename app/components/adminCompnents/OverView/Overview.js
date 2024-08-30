// src/app/components/AdminClientPage.js
// 'use client';

import SideBar from "../sidebar/sideBar";
import Topbar from "../topbar/topbar";
import Charts from "../OverView/OverviewComponents/Charts.js";
import BarCharts from "./OverviewComponents/BarChart";
import Revenue from "./OverviewComponents/Revenue";
import MovingGradientChart from "./OverviewComponents/MovingGradientChart";

export default function AdminClientPage({ session }) {
  return (
    <div className="flex">
      <SideBar />
      <div className="flex flex-col w-full">
        <Topbar />
        <div className="flex justify-left gap-5 mt-10 ">
          <Charts
            labelText="Total Number of App Downloads"
            percentage={18}
            changeText="10%"
            changeColor="red"
            color="#3498db"
            textColor="#333"
            filledRatio={0.18} // Custom filled ratio
          />
          <Charts
            labelText="Total Number Job Posted"
            percentage={64}
            changeText="16%"
            changeColor="red"
            color="#75E76B"
            textColor="#333"
            filledRatio={0.64} // Custom filled ratio

          />
          <Charts
            labelText="Total Number Of Users"
            percentage={98}
            changeText="12%"
            changeColor="red"
            color="#79D2DE"
            textColor="#333"
            filledRatio={0.98} // Custom filled ratio
          />

        </div >
        <div className="flex flex-row gap-5 py-12 px-5 ">
          <div className="w-[70%]">
            <BarCharts />
          </div>
          <div className="w-[30%]">
            <Revenue />
          </div>
        </div>
      </div>
    </div>
  );
}

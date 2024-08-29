import React from 'react'
import Sidebar from '../sidebar/sideBar'
import Topbar from '../topbar/topbar'
import Jobposted from './jobposted'
export default function jobs() {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col w-full">
          <Topbar />
          <Jobposted />
        </div>
      </div>
    </>
  )
}

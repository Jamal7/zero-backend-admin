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
          <div className='flex flex-row w-[80%]'>
          <Jobposted />
          </div>
        </div>
      </div>
    </>
  )
}

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
          <div className='flex flex-row md:w-[80%] w-[100%] py-10 px-2 md:px-10'>
          <Jobposted />
          </div>
        </div>
      </div>
    </>
  )
}

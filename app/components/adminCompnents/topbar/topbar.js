// components/Navbar.js
'use client'
import Image from 'next/image';
import { useState } from 'react';
import adminProfile from '../../../../public/icons/profileImg.svg';
import notification from '../../../../public/icons/topbar-icon/notifications.svg';
import vector from '../../../../public/icons/topbar-icon/Vector.svg';
import logout from '../../../../public/icons/topbar-icon/logout.svg';
import searchIcon from '../../../../public/icons/topbar-icon/search.svg';
import { signOut } from 'next-auth/react';



export default function Topbar() {
    const [userName] = useState('Josh Brolin');
    const [userRole] = useState('Admin');

    return (
        <div className="flex items-center justify-between bg-white shadow py-4 px-10 h-24">
            {/* Left Side: Add New Button and Search */}
            <div className="flex items-center space-x-4">
                <button className="flex items-center h-12 px-3 py-2 border border-[#CCD4E0] text-blue-500 rounded hover:bg-blue-100">
                    <span className="mr-2">+</span> Add New
                </button>
                <div className="flex items-center bg-gray-100 px-4 h-12 rounded-lg !ml-8">
                   <Image src={searchIcon}/>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-gray-100 ml-2 outline-none"
                    />
                </div>
            </div>

            {/* Right Side: User Info and Icons */}
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 border-r pr-8">
                    <div className='flex flex-col items-end'>
                    <span className="text-black text-sm">{userName}</span>
                    <span className="text-gray-400 text-xs">{userRole}</span>
                    </div>
                    <div className="">
                        {/* User Avatar Placeholder */}
                       
                        <Image className='w-12' src={adminProfile}/>
                    </div>
                    <div className='!ml-5'>
                    <Image className='' src={vector}/>
                    </div>

                </div>

                <div className="flex items-center space-x-4 pl-3 w-24 justify-between">
                    <Image  src={notification}/>

                    <button onClick={() => signOut({ callbackUrl: '/' })}>
                        <Image src={logout} alt="Logout" />
                    </button>
                </div>
            </div>
        </div>
    );
}

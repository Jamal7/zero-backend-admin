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
        <div className="w-full flex flex-col sm:flex-row items-center justify-between bg-white shadow py-4 px-4 sm:px-10">
            {/* Left Side: Add New Button and Search */}
            <div className="flex items-center space-x-4 w-full sm:w-auto">
                <button className="flex items-center h-12 px-3 py-2 border border-[#CCD4E0] text-blue-500 rounded hover:bg-blue-100">
                    <span className="mr-2">+</span> Add New
                </button>
                <div className="flex items-center bg-gray-100 px-4 h-12 rounded-lg mt-4 sm:mt-0 sm:ml-8 w-full sm:w-auto">
                    <Image src={searchIcon} alt="Search" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-gray-100 ml-2 outline-none w-full"
                    />
                </div>
            </div>

            {/* Right Side: User Info and Icons */}
            <div className="flex items-center space-x-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center space-x-2 border-r pr-8">
                    <div className="flex flex-col items-end">
                        <span className="text-black text-sm">{userName}</span>
                        <span className="text-gray-400 text-xs">{userRole}</span>
                    </div>
                    <div className="ml-2">
                        <Image className="w-12" src={adminProfile} alt="Profile" />
                    </div>
                    <div className="ml-5">
                        <Image src={vector} alt="Vector" />
                    </div>
                </div>

                <div className="flex items-center space-x-4 pl-3">
                    <Image src={notification} alt="Notifications" />
                    <button onClick={() => signOut({ callbackUrl: '/' })}>
                        <Image src={logout} alt="Logout" />
                    </button>
                </div>
            </div>
        </div>
    );
}

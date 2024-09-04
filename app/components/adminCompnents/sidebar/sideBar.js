'use client';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../../public/zerologo.svg';
import homeIcon from '../../../../public/icons/home.svg';
import staticsIcon from '../../../../public/icons/statics.svg';
import userIcon from '../../../../public/icons/user.svg';
import jobsIcon from '../../../../public/icons/jobs.svg';
import chatboardIcon from '../../../../public/icons/chatboard.svg';
import reportsIcon from '../../../../public/icons/reports.svg';
import paymentsIcon from '../../../../public/icons/payments.svg';
import logoutIcon from '../../../../public/icons/logout.svg';
import rightArrow from '../../../../public/icons/right-arrow.png';

const sidebarItems = [
    { name: 'Overview', icon: homeIcon, isSvg: true, link: '/admin' },
    { name: 'Statistics', icon: staticsIcon, isSvg: true, link: '/admin/statistics' },
    { name: 'Users', icon: userIcon, isSvg: true, link: '/admin/users' },
    { name: 'Jobs', icon: jobsIcon, isSvg: true, link: '/admin/jobs' },
    { name: 'Chat Board', icon: chatboardIcon, isSvg: true, link: '/admin/chat-board' },
    { name: 'Payments', icon: paymentsIcon, isSvg: true, link: '/admin/payments' },
    { name: 'Reports', icon: reportsIcon, isSvg: true, link: '/admin/reports' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        // Check if the screen width is less than the lg breakpoint (1024px)
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsExpanded(true); // Ensure the sidebar is expanded on large screens
            } else {
                setIsExpanded(false); // Collapse the sidebar on smaller screens
            }
        };

        handleResize(); // Set the initial state based on the screen width
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div
            className={`
                bg-[#5B8DD7] ${isExpanded ? 'w-64' : 'w-20'} min-h-screen py-4 pt-12 flex flex-col justify-between transition-all duration-300 
                fixed lg:relative top-0 left-0 ${isExpanded ? 'lg:w-64' : 'lg:w-20'} z-50 
            `}
        >
            <div 
                className="absolute bg-white w-10 h-[40px] top-10 right-[-20px] rounded-full shadow-[4px_4px_10px_rgba(0,0,0,0.2)] flex justify-center items-center cursor-pointer lg:hidden"
                onClick={toggleSidebar}
            >
                <Image src={rightArrow} alt="Right Arrow Icon" width={20} height={20} className={`${isExpanded ? 'rotate-180' : ''} transition-transform duration-300`} />
            </div>

            <div className="flex flex-col items-center justify-center">
                <div className="relative mb-5 md:mb-14 flex gap-4 text-white font-bold text-lg md:pl-10 px-5">
                    <Image src={logo} alt="Dashboard Logo" />
                    {isExpanded && <span className="mr-5">Dashboard</span>}
                </div>

                <ul className="w-full">
                    {sidebarItems.map((item, index) => (
                        <li key={index} className="mb-4">
                            <Link href={item.link} passHref>
                                <div className={`flex items-center ${isExpanded ? 'md:pl-10 px-5' : 'md:pl-5 px-1 justify-center'} py-3 text-white gap-4 rounded ${pathname === item.link ? 'bg-[#78A1DE]' : 'hover:bg-[#78A1DE]'}`}>
                                    <Image src={item.icon} alt={item.name} width={16} height={16} className="mr-2" />
                                    {isExpanded && <span>{item.name}</span>}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="text-white hover:bg-[#78A1DE] gap-4 pl-10 py-5 flex rounded cursor-pointer">
                <Image src={logoutIcon} alt="Logout Icon" />
                {isExpanded && <span>Logout</span>}
            </div>
        </div>
    );
}

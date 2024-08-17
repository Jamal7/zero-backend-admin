'use client'
import { usePathname } from 'next/navigation';
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

const sidebarItems = [
    { name: 'Overview', icon: homeIcon, isSvg: true, link: '/admin/overview' },
    { name: 'Statistics', icon: staticsIcon, isSvg: true, link: '/admin/statistics' },
    { name: 'Users', icon: userIcon, isSvg: true, link: '/admin/users' },
    { name: 'Jobs', icon: jobsIcon, isSvg: true, link: '/admin/jobs' },
    { name: 'Chat Board', icon: chatboardIcon, isSvg: true, link: '/admin/chat-board' },
    { name: 'Payments', icon: paymentsIcon, isSvg: true, link: '/admin/payments' },
    { name: 'Reports', icon: reportsIcon, isSvg: true, link: '/admin/reports' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="bg-[#5B8DD7] w-64 min-h-screen py-4 pt-12 flex flex-col justify-between">
            <div>
                <div className="mb-14 flex gap-4 text-white font-bold text-lg pl-10">
                    <Image src={logo} alt="Dashboard Logo" /> <span> Dashboard</span>
                </div>
                <ul className=''>
                    {sidebarItems.map((item, index) => (
                        <li key={index} className="mb-4">
                            <Link href={item.link} passHref>
                                <div className={`flex items-center pl-10 text-white py-3 gap-4 rounded ${pathname === item.link ? 'bg-[#78A1DE]' : 'hover:bg-[#78A1DE]'}`}>
                                    {item.isSvg ? (
                                        <Image src={item.icon} alt={item.name} width={16} height={16} className="mr-2" />
                                    ) : (
                                        <span className="mr-2 text-[16px] leading-5 font-normal ">{item.icon}</span>
                                    )}
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="text-white hover:bg-[#78A1DE] gap-4 pl-10 py-5 flex rounded cursor-pointer">
                <Image src={logoutIcon} alt="Logout Icon"/><span> Logout</span>
            </div>
        </div>
    );
}

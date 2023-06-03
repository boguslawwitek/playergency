'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faGamepad, faTrophy, faGear, faX } from "@fortawesome/free-solid-svg-icons";
import Nav from "./Nav";
import { useState } from "react";
import classNames from "classnames";
import Link from "next/link";

interface DashboardNavProps {
    iconUrl: string,
    backendUrl: string,
    dictionary: {
        home: string,
        dashboard: string,
        ranking: string,
        login: string,
        roles: string,
        settings: string,
        profile: string,
        logout: string,
        'go-to-dashboard': string
    }
    userData: {
        username: string,
        userId: string,
        avatarUrl: string,
        admin: boolean
    },
    activeLink: "profile" | "roles" | "ranking" | "admin"
}

export default function DashboardNav({iconUrl, dictionary, backendUrl, userData, activeLink}:DashboardNavProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (<>
        <Nav iconUrl={iconUrl} dictionary={dictionary} withBackgroundColor={true} withoutList={true} backendUrl={backendUrl} userData={userData}>
            <button onClick={() => setIsMenuOpen(prev => !prev)} data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-white" aria-controls="navbar-sticky" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            </button>
        </Nav>
        <aside id="default-sidebar" className={classNames("fixed md:absolute top-0 left-0 z-40 md:z-30 w-64 h-screen transition-transform -translate-x-full md:translate-x-0", isMenuOpen ? 'translate-x-0' : null)} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800 pt-16 md:pt-[78px] relative">
            <button role="button" className="inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-white absolute top-0 right-3" onClick={() => setIsMenuOpen(false)} ><FontAwesomeIcon className="text-xl border-2 border-gray-500 p-3 rounded-lg" icon={faX} /></button>
            <ul className="space-y-2 font-medium">
                <li>
                    <Link href="/dashboard/profile" className={classNames("flex items-center p-2 rounded-lg text-white hover:bg-gray-700", activeLink === 'profile' ? 'bg-gray-700 cursor-default' : null)}>
                        <FontAwesomeIcon icon={faUser} className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" />
                        <span className="ml-3">{dictionary.profile}</span>
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard" className={classNames("flex items-center p-2 rounded-lg text-white hover:bg-gray-700", activeLink === 'roles' ? 'bg-gray-700 cursor-default' : null)}>
                        <FontAwesomeIcon icon={faGamepad} className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" />
                        <span className="ml-3">{dictionary.roles}</span>
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard/ranking" className={classNames("flex items-center p-2 rounded-lg text-white hover:bg-gray-700", activeLink === 'ranking' ? 'bg-gray-700 cursor-default' : null)}>
                        <FontAwesomeIcon icon={faTrophy} className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" />
                        <span className="ml-3">{dictionary.ranking}</span>
                    </Link>
                </li>
                {userData.admin ?
                    <li>
                        <Link href="/dashboard/admin" className={classNames("flex items-center p-2 rounded-lg text-white hover:bg-gray-700", activeLink === 'admin' ? 'bg-gray-700 cursor-default' : null)}>
                            <FontAwesomeIcon icon={faGear} className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" />
                            <span className="flex-1 ml-3 whitespace-nowrap">{dictionary.settings}</span>
                            <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium rounded-full bg-gray-700 text-gray-300">Admin</span>
                        </Link>
                    </li>
                : null}
            </ul>
        </div>
        </aside>
    </>)
}
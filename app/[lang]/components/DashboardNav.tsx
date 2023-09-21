'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faGamepad, faTrophy, faGear, faX, faHome } from "@fortawesome/free-solid-svg-icons";
import Nav from "./Nav";
import { useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { useParams } from 'next/navigation';

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
        'go-to-dashboard': string,
        'settings-categories': string,
        'settings-roles': string,
        'settings-admins': string
    }
    userData: {
        username: string,
        userId: string,
        avatarUrl: string,
        admin: boolean,
        guildMember: boolean
        owner: boolean
    },
    activeLink: "profile" | "roles" | "ranking" | "adminCategories" | "adminRoles" | "adminAdmins"
}

export default function DashboardNav({iconUrl, dictionary, backendUrl, userData, activeLink}:DashboardNavProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
    const { userId } = useParams();

    return (<>
        <Nav iconUrl={iconUrl} dictionary={dictionary} withBackgroundColor={true} withoutList={true} backendUrl={backendUrl} userData={userData} activeLink={activeLink}>
            <button onClick={() => setIsMenuOpen(prev => !prev)} data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-white" aria-controls="navbar-sticky" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            </button>
        </Nav>
        <aside id="default-sidebar" className={classNames("fixed md:absolute top-0 left-0 z-40 md:z-30 w-64 h-screen transition-transform -translate-x-full md:translate-x-0", isMenuOpen ? 'translate-x-0' : null)} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800 pt-16 md:pt-[78px] relative">
            <button role="button" className="inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-white absolute top-0 right-3" onClick={() => setIsMenuOpen(false)} ><FontAwesomeIcon className="text-xl border-2 border-gray-500 p-3 rounded-lg" icon={faX} /></button>
            <ul className="space-y-2 font-medium">
                <li className="mt-2">
                    <Link href="/" className={classNames("select-none flex items-center p-2 rounded-lg text-white hover:bg-gray-700")}>
                        <FontAwesomeIcon icon={faHome} className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" />
                        <span className="ml-3">{dictionary.home}</span>
                    </Link>
                </li>
                <li>
                    <Link href={userData.userId ? `/dashboard/profiles/${userData.userId}` : `#`} className={classNames("select-none flex items-center p-2 rounded-lg text-gray-400 cursor-default pointer-events-none", userData.userId && userData.guildMember ? 'hover:bg-gray-700 cursor-pointer pointer-events-auto text-white' : null, activeLink === 'profile' && userId === userData.userId ? 'bg-gray-700 cursor-default' : null)}>
                        <FontAwesomeIcon icon={faUser} className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" />
                        <span className="ml-3">{dictionary.profile}</span>
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard" className={classNames("select-none flex items-center p-2 rounded-lg text-white hover:bg-gray-700", activeLink === 'roles' ? 'bg-gray-700 cursor-default' : null)}>
                        <FontAwesomeIcon icon={faGamepad} className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" />
                        <span className="ml-3">{dictionary.roles}</span>
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard/ranking" className={classNames("select-none flex items-center p-2 rounded-lg text-white hover:bg-gray-700", activeLink === 'ranking' ? 'bg-gray-700 cursor-default' : null)}>
                        <FontAwesomeIcon icon={faTrophy} className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" />
                        <span className="ml-3">{dictionary.ranking}</span>
                    </Link>
                </li>
                {userData.admin ?
                <li>
                    <button type="button" onClick={() => setIsAdminSettingsOpen(prev => prev = !prev)} className={classNames("flex items-center w-full p-2 text-base transition duration-75 rounded-lg group text-white hover:bg-gray-700", activeLink === "adminCategories" || activeLink === "adminRoles" || activeLink === "adminAdmins" ? 'bg-gray-700' : null)} aria-controls="dropdown-admin-settings" data-collapse-toggle="dropdown-admin-settings">
                            <FontAwesomeIcon icon={faGear} className="w-6 h-6 transition duration-75 text-gray-400 group-hover:text-white" />
                            <span className="flex-1 ml-3 whitespace-nowrap">{dictionary.settings}</span>
                            <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium rounded-full bg-gray-700 text-gray-300">Admin</span>
                        <svg className="w-3 h-3 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </button>
                    <ul id="dropdown-admin-settings" className={classNames("py-2 space-y-2", isAdminSettingsOpen ? null : 'hidden')}>
                        <li>
                            <Link href="/dashboard/admin/categories" className={classNames("select-none flex items-center w-full p-2 transition duration-75 rounded-lg text-white hover:bg-gray-700 pl-12 group", activeLink === 'adminCategories' ? 'bg-gray-700 cursor-default' : null)}>
                                {dictionary['settings-categories']}
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/admin/roles" className={classNames("select-none flex items-center w-full p-2 transition duration-75 rounded-lg text-white hover:bg-gray-700 pl-12 group", activeLink === 'adminRoles' ? 'bg-gray-700 cursor-default' : null)}>
                                {dictionary['settings-roles']}
                            </Link>
                        </li>
                        {userData.owner ?
                        <li>
                            <Link href="/dashboard/admin/admins" className={classNames("select-none flex items-center w-full p-2 transition duration-75 rounded-lg text-white hover:bg-gray-700 pl-12 group", activeLink === 'adminAdmins' ? 'bg-gray-700 cursor-default' : null)}>
                                {dictionary['settings-admins']}
                            </Link>
                        </li>
                        : null}
                    </ul>
                </li>
                : null}
            </ul>
        </div>
        </aside>
    </>)
}
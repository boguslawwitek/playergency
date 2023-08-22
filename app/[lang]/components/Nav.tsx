'use client'
import { useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface NavProps {
    withBackgroundColor?: Boolean,
    withoutList?: Boolean,
    children?: ReactNode,
    backendUrl: string,
    iconUrl: string,
    dictionary: {
        home: string,
        dashboard: string,
        ranking: string,
        login: string,
        logout: string,
        'go-to-dashboard': string
    },
    userData: {
        username: string,
        userId: string,
        avatarUrl: string,
        admin: boolean,
        guildMember: boolean
    }
    activeLink?: string
}

export default function Nav({iconUrl, dictionary, withBackgroundColor, withoutList, children, backendUrl, userData, activeLink}:NavProps) {
    const { push } = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    function handleLoginBtn() {
        push(`${backendUrl}/auth/login`);
    }

    function handleLogoutBtn() {
        push(`${backendUrl}/auth/logout`);
    }

    return (
        <nav className={classNames(withBackgroundColor ? 'bg-gray-900' : 'bg-transparent', 'absolute top-0 left-0 w-full z-40')}>
        <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4 flex-col sm:flex-row sm:justify-between">
        <Link href="/" className="flex items-center">
            {iconUrl ? <img src={iconUrl} className="h-8 mr-3" alt="Playergency Logo" /> : null}
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Playergency</span>
        </Link>
        <div className="mt-2 sm:mt-0 flex md:order-2">
            {userData.userId ? <div className="relative">
                <button role="button" onClick={() => setIsUserDropdownOpen(prev => !prev)} className="flex items-center space-x-4">
                    <img className="w-10 h-10 rounded-full" src={userData.avatarUrl} alt="" />
                    <div className="font-medium text-white">
                        <div>{userData.username}</div>
                        {userData.admin ? <div className="text-sm text-indigo-400">Administrator</div> : null}
                    </div>
                </button>

                <div id="userDropdown" className={classNames("absolute top-16 right-0.5 z-10 divide-y rounded-lg shadow w-44 bg-gray-700 divide-gray-600", isUserDropdownOpen ? null : 'hidden')}>
                    {!activeLink ? 
                    <ul className="py-2 text-sm text-gray-200" aria-labelledby="avatarButton">
                        <li>
                            <Link href="/dashboard" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-600 hover:text-white">{dictionary['go-to-dashboard']}</Link>
                        </li>
                    </ul> : null}
                    <div className="py-1">
                        <button onClick={handleLogoutBtn} className="text-left block w-full px-4 py-2 text-sm hover:bg-gray-600 text-red-200 hover:text-white">{dictionary.logout}</button>
                    </div>
                </div>
            </div>
            : <button type="button" onClick={handleLoginBtn} className="select-none text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600">{dictionary.login}</button>}
            {!withoutList ? 
            <button onClick={() => setIsMenuOpen(prev => !prev)} data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 ml-2 text-sm text-white rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-white" aria-controls="navbar-sticky" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            </button> : null}
            {children}
        </div>
        {!withoutList ?
        <div className={isMenuOpen ? "items-center justify-between w-full md:flex md:w-auto md:order-1" : "items-center justify-between w-full md:flex md:w-auto md:order-1 hidden"} id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-900 border-gray-800 md:bg-transparent">
            <li>
                <Link href="/" className="block py-2 pl-3 pr-4 rounded md:p-0 md:hover:underline text-white hover:border-indigo-600 hover:text-white md:hover:bg-transparent border-indigo-600" aria-current="page">{dictionary.home}</Link>
            </li>
            <li>
                <Link href="/dashboard" className="block py-2 pl-3 pr-4 rounded md:p-0 md:hover:underline text-white hover:border-indigo-600 hover:text-white md:hover:bg-transparent border-indigo-600">{dictionary.dashboard}</Link>
            </li>
            <li>
                <a href="#" className="block py-2 pl-3 pr-4 rounded md:p-0 md:hover:underline text-white hover:border-indigo-600 hover:text-white md:hover:bg-transparent border-indigo-600">{dictionary.ranking}</a>
            </li>
            </ul>
        </div>
        : null}
        </div>
        </nav>
    )
}
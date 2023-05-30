'use client'
import classNames from "classnames";
import Link from "next/link";
import { useState, useEffect } from "react";

interface CookiesBannerProps {
    dictionary: {
        desc: string,
        'accept-btn': string,
        'more-info': string
    }
}

export default function CooskiesBanner({dictionary}:CookiesBannerProps) {
    const [isVisible, setIsVisible] = useState(false);

    function cookiesParse() {
        return Object.fromEntries(document.cookie.split(/; */).map(c => {
            const [ key, v ] = c.split('=', 2);
            return [ key, decodeURIComponent(v) ];
        }));
    }

    useEffect(() => {
        const cookies = cookiesParse();

        if(!document.cookie || !cookies.hasOwnProperty('cookiesConfirm')) {
            document.cookie = "cookiesConfirm=false;expires=Tue, 19 Jan 2038 03:14:07 GMT;path=/";
            setIsVisible(prev => prev = true);
        }

        if(cookies.hasOwnProperty('cookiesConfirm') && cookies['cookiesConfirm'] === "true") {
            setIsVisible(prev => prev = false);
        } else if(cookies.hasOwnProperty('cookiesConfirm') && cookies['cookiesConfirm'] === "false") {
            setIsVisible(prev => prev = true);
        }
    }, [])

    function handleBtn() {
        const cookies = cookiesParse();
        if(cookies.hasOwnProperty('cookiesConfirm') && cookies['cookiesConfirm'] === "false") {
            document.cookie = "cookiesConfirm=true;expires=Tue, 19 Jan 2038 03:14:07 GMT;path=/";
            setIsVisible(prevState => prevState = false);
        }
    }

    return (
        <div className={classNames('fixed bottom-0 left-0 z-20 w-full p-4 border-t shadow md:flex md:items-center md:justify-between md:p-6 bg-gray-900 border-gray-600', isVisible ? null : 'hidden opacity-0 invisible')}>
            <div className="max-w-screen-xl m-auto flex flex-col md:flex-row justify-between items-center">
                <div className="md:max-w-[50%] px-2">{dictionary.desc}</div>
                <div className="pt-6 md:pt-0 flex flex-col sm:flex-row justify-center items-center">
                    <button role="button" onClick={handleBtn} className="text-white focus:ring-4 font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-indigo-800">{dictionary["accept-btn"]}</button>
                    <Link href="/privacy-policy" className="text-white focus:outline-none focus:ring-4 font-medium rounded-lg text-lg px-5 py-2.5 mr-2 mb-2 bg-gray-800 hover:bg-gray-700 focus:ring-gray-700 border-gray-700">{dictionary["more-info"]}</Link>
                </div>
            </div>
        </div>
    )
}
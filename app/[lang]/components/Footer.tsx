import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHandshakeAngle, faFileContract} from "@fortawesome/free-solid-svg-icons";
import {faDiscord, faTwitch, faTwitter, faYoutube, faSpotify, faFacebook, faSteam} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

interface FooterProps {
    children: ReactNode,
    dictionary: {
        'privacy-policy': string,
        group: string,
        copyright: string,
        author: string
    }
}

export default function Footer({children, dictionary}: FooterProps) {
    return (
        <footer className="bg-gray-900 border-t-2 border-gray-800">
        <div className="mx-auto w-full max-w-screen-xl">
        <div className="w-full px-4 py-3 sm:py-6 lg:py-8">
            <div>
                <ul className="max-w-screen-lg text-gray-100 font-medium flex flex-col flex-wrap sm:max-h-[220px]">
                    <li className="mb-4 flex items-center">
                        <FontAwesomeIcon icon={faDiscord} className="text-lg w-6 mr-1" />
                        <a href="https://discord.gg/85cV6Et" target="blank" className=" hover:underline">Discord</a>
                    </li>
                    <li className="mb-4 flex items-center">
                        <FontAwesomeIcon icon={faTwitter} className="text-lg w-6 mr-1" />
                        <a href="https://twitter.com/playergency" target="blank" className="hover:underline">Twitter</a>
                    </li>
                    <li className="mb-4 flex items-center">
                        <FontAwesomeIcon icon={faFacebook} className="text-lg w-6 mr-1" />
                        <a href="https://www.facebook.com/Playergency" target="blank" className="hover:underline">Facebook</a>
                    </li>
                    <li className="mb-4 flex items-center">
                        <FontAwesomeIcon icon={faSteam} className="text-lg w-6 mr-1" />
                        <a href="https://steamcommunity.com/groups/playergency" target="blank" className="hover:underline">{dictionary.group} Steam</a>
                    </li>
                    <li className="mb-4 flex items-center">
                        <FontAwesomeIcon icon={faFacebook} className="text-lg w-6 mr-1" />
                        <a href="https://www.facebook.com/groups/playergency" target="blank" className="hover:underline">{dictionary.group} Facebook</a>
                    </li>
                    <li className="mb-4 flex items-center">
                        <FontAwesomeIcon icon={faYoutube} className="text-lg w-6 mr-1" />
                        <a href="https://www.youtube.com/channel/UCVc-2YValRpTkBl5yElyCgQ" target="blank" className="hover:underline">YouTube</a>
                    </li>
                    <li className="mb-4 flex items-center">
                        <FontAwesomeIcon icon={faHandshakeAngle} className="text-lg w-6 mr-1" />
                        <a href="https://patronite.pl/playergency" target="blank" className="hover:underline">Patronite</a>
                    </li>
                    <li className="mb-4 flex items-center">
                        <FontAwesomeIcon icon={faSpotify} className="text-lg w-6 mr-1" />
                        <a href="https://spoti.fi/2H6ixr5" target="blank" className="hover:underline">Spotify</a>
                    </li>
                    <li className="mb-4 flex items-center">
                        <FontAwesomeIcon icon={faTwitch} className="text-lg w-6 mr-1" />
                        <a href="https://www.twitch.tv/playergency" target="blank" className="hover:underline">Twitch</a>
                    </li>
                    <li className="mb-4 flex items-center">
                        <FontAwesomeIcon icon={faFileContract} className="text-lg w-6 mr-1" />
                        <Link href="/privacy-policy" className="hover:underline">{dictionary["privacy-policy"]}</Link>
                    </li>
                </ul>
            </div>
        </div>
        <div className="px-4 py-6 flex flex-col items-center justify-center sm:justify-between sm:flex-row">
            {children}
            <span className="text-sm text-gray-200 text-center">© 2016-2023 Playergency. {dictionary.copyright}<br/>{dictionary.author} <a href="https://bwitek.dev" target="_blank">BWitek.dev</a></span>
        </div>
        </div>
        </footer>
    )
}
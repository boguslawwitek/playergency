'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from "react";
import classNames from "classnames";

interface UserProfileProps {
    dictionary: {
        "close-modal": string,
        "share-profile": string,
        level: string,
        "joined-at": string,
        "created-at": string,
        loading: string,
        "copy-link": string,
        "unknown-user": string,
        days: string
    },
    backendUrl: String,
    lang: String
}

export default function UserProfile({dictionary, backendUrl, lang}: UserProfileProps) {
    const { userId } = useParams();
    const pathname = usePathname();
    const [userData, setUserData] = useState<any>(null);
    const [unknownUserInfo, setUnknownUserInfo] = useState('');
    const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
    const inputShare = useRef<HTMLInputElement>(null);

    useEffect(() => {

        if(userId) {
            fetch(`${backendUrl}/profile/getUser/${userId}`).then(res => {
                res.json().then(json => {
                    if(!json.error && json.error !== 'Unknown user') {
                        setUserData(json.userData);
                    }
                });
            });
        }

        const timer = setTimeout(() => {
            setUnknownUserInfo(dictionary["unknown-user"]);
          }, 2000);
          return () => clearTimeout(timer);

    }, [backendUrl, userId, dictionary]);

    function handleCopyLink() {
        if(inputShare != null) {
            inputShare.current?.select();
            inputShare.current?.focus();
            navigator.clipboard.writeText(`https://playergency.com${pathname}`);
        }
    }

    return (<>
        {userData ? 
        <div className="min-h-[100vh] px-8 md:px16 py-2 max-w-screen-xl m-auto"> 
            <div className="flex items-center flex-col justify-start mt-6">
                <div className="w-full max-w-screen-sm relative">
                    <button className="group rounded-full w-12 h-12 absolute right-0 md:right-2 top-2 bg-gray-700 flex justify-center items-center cursor-pointer hover:bg-gray-200" onClick={() => setShareModalIsOpen(prev => !prev)}><FontAwesomeIcon icon={faShare} className="text-gray-200 group-hover:text-gray-700" /></button>

                    <div id="share-modal" aria-hidden="true" className={classNames("absolute top-14 right-0 w-72 md:w-96 p-2 overflow-x-hidden overflow-y-auto h-60", shareModalIsOpen ? '' : 'hidden')}>
                        <div className="relative w-full max-w-md max-h-full">
                            <div className="relative rounded-lg shadow bg-gray-700">
                                <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" onClick={() => setShareModalIsOpen(false)}>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                    <span className="sr-only">{dictionary["close-modal"]}</span>
                                </button>
                                <div className="px-6 py-6 lg:px-8">
                                    <h3 className="mb-4 text-xl font-medium text-white">{dictionary["share-profile"]}</h3>
                                    <div className="pb-4">
                                        <input ref={inputShare} type="text" name="copylink" id="copylink" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-indigo-500 block w-full p-2.5 bg-gray-600 border-gray-500 text-white" value={`https://playergency.com${pathname}`} readOnly />
                                    </div>
                                    <button type="button" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-800" onClick={handleCopyLink}>{dictionary["copy-link"]}</button>
                                </div>
                            </div>
                        </div>
                    </div> 

                </div>
                <img className="w-64 h-64 p-1 rounded-full ring-2 ring-gray-500" src={userData.avatarUrl} alt={`${userData.username} avatar`} />
                <div className="flex items-center justify-center space-x-6 w-full">
                    <div className="font-medium text-white w-full max-w-screen-sm">
                        {userData.admin ? <div className="w-full flex justify-center items-center mt-4"><div className="text-lg w-min py-1 px-2 rounded-lg bg-indigo-700">{lang === 'pl' ? userData.adminRolePL : userData.adminRoleEN}</div></div> : null}
                        <div className="text-3xl mt-2">{userData.username}</div>
                        <div className="text-2xl text-gray-400" style={{color: userData.levelColor}}>{dictionary.level} {userData.level}</div>
                        <div className="w-full h-8 mb-4 mt-2 rounded-full bg-gray-700 relative">
                            <div className="h-8 rounded-full bg-indigo-500" style={{width: `${userData.levelPercentOfGoal}%`}}></div>
                            <p className="absolute text-sm font-medium top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">{userData.exp} / {userData.goal} XP</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-8">
                <div className="w-full max-w-md p-2 border rounded-lg shadow sm:p-4 bg-gray-700 border-gray-600">
                <div className="flow-root">
                        <ul role="list" className="divide-y divide-gray-600">
                            <li className="py-3 sm:py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate text-white">
                                            Ranking:
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-indigo-400">
                                        {userData.ranking}
                                    </div>
                                </div>
                            </li>
                            {userData.wallet ? 
                            <li className="py-3 sm:py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate text-white">
                                            Pcoin:
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-indigo-400">
                                        {userData.wallet}
                                    </div>
                                </div>
                            </li> : null}
                            <li className="py-3 sm:py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate text-white">
                                            {dictionary["joined-at"]}:
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-indigo-400">
                                        {`${new Date(userData.guildMemberJoinedAt).toLocaleDateString('pl-PL', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            second: 'numeric'
                                        })} (${userData.guildMemberJoinedAtDays} ${dictionary.days})`}
                                    </div>
                                </div>
                            </li>
                            <li className="py-3 sm:py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate text-white">
                                            {dictionary["created-at"]}:
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-indigo-400">
                                        {`${new Date(userData.discordCreatedAt).toLocaleDateString('pl-PL', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            second: 'numeric'
                                        })} (${userData.discordCreatedAtDays} ${dictionary.days})`}
                                    </div>
                                </div>
                            </li>
                        </ul>
                </div>
                </div>
            </div>
        </div> : 
        <div className="min-h-[100vh] px-8 md:px16 py-2 max-w-screen-xl m-auto">
            <div className="flex items-center flex-col justify-center mt-12">
                <div className="font-medium text-lg">{unknownUserInfo ? unknownUserInfo : 
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 animate-spin text-gray-600 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">{dictionary.loading}...</span>
                    </div>
                }</div>
            </div>
        </div>}
    </>)
}
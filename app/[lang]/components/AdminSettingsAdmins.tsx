'use client'
import { useState, useEffect} from "react";
import classNames from "classnames";
import useSWR from 'swr';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { arrayMove, generateRandomString, fetcher } from "../utilsClient";
import { useRouter } from 'next/navigation';

interface AdminSettingsAdminsProps {
    backendUrl: string,
    dictionary: {
        "settings-categories": string,
        "settings-roles": string,
        "settings-admins": string,
        userid: string,
        desc: string,
        role: string,
        "add-category": string,
        "add-admin": string,
        "save-changes": string,
        "access-admin-dashboard": string,
        "visible-on-homepage": string,
        done: string,
        "close-modal": string,
        "search-user": string,
        loading: string
    }
}



export default function AdminSettingsCategories({dictionary, backendUrl}:AdminSettingsAdminsProps) {
    const [adminsState, setAdminsState] = useState<any[]>([]);
    const [adminsStateForDelete, setAdminsStateForDelete] = useState<any[]>([]);
    const [visibleAdmin, setVisibleAdmin] = useState<String>("");
    const [statusInfo, setStatusInfo] = useState('');
    const router = useRouter();
    const [addAdminModalIsOpen, setAddAdminModalIsOpen] = useState(false);
    const [addAdminInput, setAddAdminInput] = useState('');
    const [fetchUser, setFetchUser] = useState<any>({});
    const { data, error, isLoading } = useSWR(`${backendUrl}/admin/getAdmins`, fetcher);
    const { data:userData, error:userDataError } = useSWR(`${backendUrl}/auth/getUser`, fetcher);

    useEffect(() => {
        if(userData && !userDataError && !userData?.owner) {
            router.push('/');
        }

        if(data && !error) {
            setAdminsState(prev => {
                prev = data.admins.map((a: any) => {
                    return {...a, isNewAdmin: false}
                });
    
                return prev;
            });

            if(data.admins.length > 0) setVisibleAdmin(data.admins[0].userid);
        }

    }, [userData, router, backendUrl, data, error, userDataError])

    function handleChangeVisibleAdminSettings(userid: String) {
        setVisibleAdmin(userid);
    }

    function handleInputs(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, name: string, userId: string) {
        const cloneState = [...adminsState];

        const adminsMap = cloneState.map((a: any) => {
            if(a.userid === userId) {
                a[name] = e.target.value;
            }
            return a;
        })
        setAdminsState(adminsMap);
    }

    function handleRolesCheckboxes(e: React.ChangeEvent<HTMLInputElement>, userId: string, name: string) {
        const cloneState = [...adminsState];

        const adminsMap = cloneState.map((a: any) => {
            if(a.userid === userId) {
                a[name] = e.target.checked;
            }
            return a;
        })

        setAdminsState(adminsMap);
    }

    function handleDeleteAdmin(index: number) {
        const cloneState = [...adminsState];

        const forDeleteEl: any = cloneState.splice(index, 1);

        if(!forDeleteEl[0].isNewAdmin) {
            const cloneForDeleteState = [...adminsStateForDelete];
            cloneForDeleteState.push(forDeleteEl[0]);
            setAdminsStateForDelete(cloneForDeleteState);
        }

        const newAdminsState = cloneState.map((a: any, index: number) => {
            a.index = index;
            return a;
        });

        setAdminsState(newAdminsState);
        if(adminsState.length > 0) setVisibleAdmin(newAdminsState[0].userid);
        else setVisibleAdmin('');
    }

    function handleChangeIndexBtn(type: String, index: number) {
        const cloneState = [...adminsState];

        if(type === 'up') {
            if(index > 0) {
                arrayMove(cloneState, index, index - 1);
            }
        } else if(type === 'down') {
            if(index < (cloneState.length - 1)) {
                arrayMove(cloneState, index, index + 1)
            }
        }

        const newAdminsState = cloneState.map((a: any, index: number) => {
            a.index = index;
            return a;
        });

        setAdminsState(newAdminsState);
    }

    function handleFetchUser() {
        setFetchUser({});

        fetch(`${backendUrl}/admin/getNewAdminUserData`, {
            method: "POST",
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({userid: addAdminInput}),
        }).then(res => res.json()).then(res => {
            if(res.userData.username && res.userData.avatarUrl && res.userData.userid) {
                if(!adminsState.find(admin => admin.userid === res.userData.userid)) setFetchUser({username: res.userData.username, avatarUrl: res.userData.avatarUrl, userid: res.userData.userid});
                
            }
        });
    }

    function handleAddAdmin() {
        const cloneState = [...adminsState];
        cloneState.push({userid: fetchUser.userid, avatarUrl: fetchUser.avatarUrl, username: fetchUser.username, rolePL: '', roleEN: '', descPL: '', descEN: '', adminDashboard: false, visibilityOnHomepage: false, index: 0, _id: generateRandomString(), isNewAdmin: true});

        const newAdminsState = cloneState.map((a: any, index: number) => {
            a.index = index;
            return a;
        });

        setAdminsState(newAdminsState);
        setVisibleAdmin(fetchUser.userid);
        setAddAdminModalIsOpen(false);
    }

    function handleSubmit() {
        setStatusInfo('');

        fetch(`${backendUrl}/admin/updateAdmins`, {
            method: "PUT",
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({admins: adminsState, forDelete: adminsStateForDelete}),
        }).then(res => {
            setStatusInfo(dictionary.done)

            setTimeout(() => {
                setStatusInfo('');
            }, 5000)
        });
    }

    const adminsMap = adminsState.map((admin: any, index: number) => {

        return (
            <li key={index}>
                <button onClick={() => handleChangeVisibleAdminSettings(admin.userid)} className={classNames("flex items-center px-2 py-3 rounded-2xl hover:bg-gray-700 cursor-pointer mt-2", visibleAdmin === admin.userid ? 'bg-gray-700' : null)}>
                    <img className="w-12 h-12 rounded-full" src={admin.avatarUrl} alt="" />
                    <p className="text-lg font-medium truncate text-white ml-3">
                        {admin.username}
                    </p>
                </button>
            </li>
        )
    });

    const adminsSettingsMap = adminsState.map((admin: any, index: number) => {

        return (
            <div key={index} className={classNames("flex justify-start items-center flex-col relative", visibleAdmin === admin.userid ? null : 'hidden')}>
                <div className="font-semibold text-2xl mt-16 xl:mt-0">{admin.username}</div>

                <div className="flex justify-center items-center mb-2 md:mb-0 absolute left-0 lg:left-32 top-0">
                    <button onClick={() => handleChangeIndexBtn('up', index)} disabled={index === 0 ? true : false} className="ml-2 group rounded-full w-12 h-12 bg-gray-700 flex justify-center items-center cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"><FontAwesomeIcon icon={faAngleUp} className="text-gray-200 group-hover:text-gray-700 group-disabled:pointer-events-none" /></button>
                    <button onClick={() => handleChangeIndexBtn('down', index)} disabled={index === (adminsState.length - 1) ? true : false} className="ml-2 group rounded-full w-12 h-12 bg-gray-700 flex justify-center items-center cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"><FontAwesomeIcon icon={faAngleDown} className="text-gray-200 group-hover:text-gray-700 group-disabled:pointer-events-none" /></button>
                </div>

                <div className="flex justify-center items-center mb-2 md:mb-0 absolute right-0 lg:right-32 top-0">
                    <button onClick={() => handleDeleteAdmin(index)} className="ml-2 group rounded-full w-12 h-12 bg-red-700 flex justify-center items-center cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"><FontAwesomeIcon icon={faXmark} className="text-gray-200 group-hover:text-red-700 group-disabled:pointer-events-none" /></button>
                </div>

                <div>
                    <label htmlFor={`admin-id-${admin._id}`}>{dictionary['userid']} (Discord): </label>
                    <input type="text" name={`admin-id-${admin._id}`} id={`admin-id-${admin._id}`} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-indigo-500 block w-full p-2.5 bg-gray-600 border-gray-500 text-white" value={admin.userid} readOnly />
                </div>

                <label className="relative inline-flex items-center cursor-pointer mt-4 select-none">
                    <input onChange={(e) => handleRolesCheckboxes(e, admin.userid, 'adminDashboard')} type="checkbox" id={`admin-admindashboard-${admin._id}`} checked={admin.adminDashboard} className="sr-only peer" />
                    <div className="w-14 h-7 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all border-gray-600 peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">{dictionary['access-admin-dashboard']}</span>
                </label>

                <label className="relative inline-flex items-center cursor-pointer mt-4 select-none">
                    <input onChange={(e) => handleRolesCheckboxes(e, admin.userid, 'visibilityOnHomepage')} type="checkbox" id={`admin-visibilityonhomepage-${admin._id}`} checked={admin.visibilityOnHomepage} className="sr-only peer" />
                    <div className="w-14 h-7 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all border-gray-600 peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-300">{dictionary['visible-on-homepage']}</span>
                </label>

                <div className="flex justify-center items-center w-full mt-4">
                    <div className="mr-4">
                        <label htmlFor={`admin-rolepl-${admin._id}`}>{dictionary['role']} (PL): </label>
                        <input onChange={(e) => handleInputs(e, 'rolePL', admin.userid)} type="text" name={`admin-rolepl-${admin._id}`} id={`admin-rolepl-${admin._id}`} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-indigo-500 block w-full p-2.5 bg-gray-600 border-gray-500 text-white" value={admin.rolePL} />
                    </div>
                    <div>
                        <label htmlFor={`admin-roleen-${admin._id}`}>{dictionary['role']} (EN): </label>
                        <input onChange={(e) => handleInputs(e, 'roleEN', admin.userid)} type="text" name={`admin-roleen-${admin._id}`} id={`admin-roleen-${admin._id}`} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-indigo-500 block w-full p-2.5 bg-gray-600 border-gray-500 text-white" value={admin.roleEN} />
                    </div>
                </div>

                <div className="w-2/3 mt-4">
                    <label htmlFor={`admin-descpl-${admin._id}`} className="block mb-2 text-sm font-medium text-white">{dictionary.desc} (PL):</label>
                    <textarea onChange={(e) => handleInputs(e, 'descPL', admin.userid)} id={`admin-descpl-${admin._id}`} rows={4} className="block p-2.5 w-full text-sm rounded-lg border bg-gray-600 border-gray-500 text-white focus:ring-indigo-500 focus:border-indigo-500" value={admin.descPL}></textarea>
                </div>

                <div className="w-2/3 mt-4">
                    <label htmlFor={`admin-descen-${admin._id}`} className="block mb-2 text-sm font-medium text-white">{dictionary.desc} (EN):</label>
                    <textarea onChange={(e) => handleInputs(e, 'descEN', admin.userid)} id={`admin-descen-${admin._id}`} rows={4} className="block p-2.5 w-full text-sm rounded-lg border bg-gray-600 border-gray-500 text-white focus:ring-indigo-500 focus:border-indigo-500" value={admin.descEN}></textarea>
                </div>
            </div>
        )
    });

    if(isLoading) return (
        <div className="min-h-[100vh] px-8 md:px16 py-2 max-w-screen-xl m-auto">
                <div className="flex items-center flex-col justify-center mt-12">
                    <div className="font-medium text-lg"> 
                        <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 mr-2 animate-spin text-gray-600 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">{dictionary.loading}...</span>
                        </div>
                    </div>
                </div>
        </div>
    )

    return (<>
        {userData.admin && userData.owner ? <>
            <h2 className="font-semibold text-2xl text-center w-full pb-4 pt-4">{dictionary['settings-admins']}</h2>
            <section className="flex max-w-screen-xl w-full justify-center items-center relative flex-col lg:flex-row">
                <div className="min-w-max">
                    <ul>      
                        {adminsMap}
                    </ul>
                    <div className="mt-12 flex flex-col justify-center items-center">
                        
                        <div onClick={() => setAddAdminModalIsOpen(false)} className={classNames("fixed top-0 left-0 right-0 bottom-0 z-40 cursor-default bg-gray-900 opacity-70", addAdminModalIsOpen ? null : 'hidden')}></div>
                        <div id="addadmin-modal" aria-hidden="true" className={classNames("fixed z-50 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] p-2 h-72", addAdminModalIsOpen ? '' : 'hidden')}>
                            <div className="relative w-full max-w-md max-h-full">
                                <div className="relative rounded-lg shadow bg-gray-700">
                                    <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" onClick={() => setAddAdminModalIsOpen(false)}>
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">{dictionary["close-modal"]}</span>
                                    </button>
                                    <div className="px-6 py-6 lg:px-8">
                                        <label htmlFor="userid">{dictionary['userid']} (Discord):</label>
                                        <div className="pb-4 flex justify-center items-center">
                                            <div className="mr-2">
                                                <input onChange={(e) => setAddAdminInput(e.target.value)} type="text" name="userid" id="userid" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-indigo-500 block w-full p-2.5 bg-gray-600 border-gray-500 text-white" value={addAdminInput} />
                                            </div>
                                            <button onClick={handleFetchUser} type="button" className="w-full focus:outline-none text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 font-medium rounded-lg text-sm px-2 py-2.5 focus:ring-yellow-900">{dictionary['search-user']}</button>
                                        </div>
                                        <div>
                                            {fetchUser && fetchUser.username ? 
                                                <div className={classNames("flex justify-center items-center px-2 py-3 rounded-2xl cursor-pointer mb-2")}>
                                                    <img className="w-12 h-12 rounded-full" src={fetchUser.avatarUrl} alt="" />
                                                    <p className="text-lg font-medium truncate text-white ml-3">
                                                        {fetchUser.username}
                                                    </p>
                                                </div> 
                                            : null}
                                        </div>
                                        <button onClick={handleAddAdmin} type="button" disabled={fetchUser && fetchUser.username ? false : true} className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-800 disabled:opacity-50 disabled:pointer-events-none">{dictionary['add-admin']}</button>
                                    </div>
                                </div>
                            </div>
                        </div> 

                        <button onClick={() => setAddAdminModalIsOpen(true)} type="button" className="w-full focus:outline-none text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:ring-yellow-900">{dictionary['add-admin']}</button>
                        <button onClick={handleSubmit} type="button" className="w-full focus:outline-none text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-green-700 hover:bg-green-800 focus:ring-green-900">{dictionary['save-changes']}</button>
                    </div>
                </div>
                <div className="w-full pt-4">
                    {adminsSettingsMap}
                </div>

            </section>
            {statusInfo ? 
                <div className="flex items-center p-4 mt-2 mb-4 text-md rounded-lg bg-gray-800 text-green-400" role="alert">
                    <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div className="flex justify-center items-center">
                        {statusInfo}
                    </div>
                </div>
            : null}
        </> : null}
    </>)
}
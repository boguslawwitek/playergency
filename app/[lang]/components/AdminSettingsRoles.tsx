'use client'
import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '../utilsClient';

interface AdminSettingsRolesProps {
    backendUrl: string,
    lang: 'pl' | 'en',
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
        "no-roles": string,
        "search": string,
        "close-modal": string,
        loading: string
    }
}

export default function AdminSettingsRoles({lang, dictionary, backendUrl}:AdminSettingsRolesProps) {
    const [rolesState, setRolesState] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [searchRoles, setSearchRoles] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { data, error, isLoading } = useSWR(`${backendUrl}/admin/getSettingsRoles`, fetcher);
    const { data:userData, error: userDataError } = useSWR(`${backendUrl}/auth/getUser`, fetcher);

    useEffect(() => {
        if(userData && !userDataError && !userData?.admin) {
            router.push('/');
        }

        if(data && !error) {
            setCategories(data.categories);

            setRolesState(prev => {
                prev = data.roles.map((r: any) => {
                    return {...r, categoriesDropdownCheckbox: false}
                });
    
                return prev;
            });
    
            setSearchRoles(prev => {
                prev = data.roles.map((r: any) => {
                    return {...r, categoriesDropdownCheckbox: false}
                });
    
                return prev;
            });
        }

    }, [userData, router, backendUrl, data, error, userDataError])

    function handleRolesCheckboxes(e: React.ChangeEvent<HTMLInputElement>, roleId: string) {
        const cloneState = [...rolesState];

        if(e.target.checked) {
            fetch(`${backendUrl}/admin/addRole`, {
                method: "POST",
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({roleId: roleId}),
            });
        } else {
            fetch(`${backendUrl}/admin/deleteRole`, {
                method: "DELETE",
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({roleId: roleId}),
            });
        }

        const rolesMap = cloneState.map((r: any) => {
            if(r.id === roleId) {
                r.isOnDatabase = !r.isOnDatabase;
                if(!e.target.checked) r.categories = [];
            }
            return r;
        })
        setRolesState(rolesMap);
    }

    function handleRolesCategoriesCheckboxes(e: React.ChangeEvent<HTMLInputElement>, roleId: string, categoryId: string) {
        const cloneState = [...rolesState];

        if(e.target.checked) {
            fetch(`${backendUrl}/admin/addCategoryToRole`, {
                method: "POST",
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({roleId: roleId, categoryId: categoryId}),
            });
        } else {
            fetch(`${backendUrl}/admin/removeCategoryFromRole`, {
                method: "POST",
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({roleId: roleId, categoryId: categoryId}),
            });
        }



        const rolesMap = cloneState.map((r: any) => {

            if(r.id === roleId) {
                if(e.target.checked) {
                    if(r.categories) r.categories.push(categoryId)
                    else r.categories = [categoryId];
                } else {
                    const index = r.categories.findIndex((c: any) => c === categoryId);
                    r.categories.splice(index, 1);
                }
            }

            return r;
        });

        setRolesState(rolesMap);
    }

    function handleCategoriesDropdownCheckboxes(roleId: string) {
        const cloneState = [...rolesState];

        const rolesMap = cloneState.map((r: any) => {
            if(r.id === roleId) r.categoriesDropdownCheckbox = !r.categoriesDropdownCheckbox;
            else r.categoriesDropdownCheckbox = false;

            return r;
        })
        setRolesState(rolesMap);
    }

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchInput(e.target.value);

        const rolesFilter = rolesState.filter((r: any) => r.name.toLowerCase().startsWith(e.target.value.trim().toLowerCase()));
        setSearchRoles(rolesFilter);
    }
    
      const rolesMap = rolesState && rolesState.length > 0 ? rolesState.map((r: any, index: number) => {
        return (<div key={index} className={classNames(!searchRoles.find(role => role.id === r.id) ? 'hidden' : null)}>
            <div onClick={() => handleCategoriesDropdownCheckboxes(r.id)} className={classNames("fixed top-0 left-0 right-0 bottom-0 z-40 cursor-default bg-gray-900 opacity-70", r.categoriesDropdownCheckbox ? null : 'hidden')}></div>
            <div id="dropdownSearch" className={classNames("fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-50 w-60 bg-gray-700 rounded-lg shadow", r.categoriesDropdownCheckbox ? null : 'hidden')}>
                <button type="button" onClick={() => handleCategoriesDropdownCheckboxes(r.id)} className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center bg-gray-600 hover:text-white">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">{dictionary['close-modal']}</span>
                </button>
                <div className="p-1">
                    <div className="px-2 py-2 border-b rounded-t border-gray-600">
                        <h3 className="text-base font-semibold lg:text-xl text-white">
                            {r.name}
                        </h3>
                    </div>
                </div>
                <ul className="h-48 px-3 pb-3 overflow-y-auto text-lg text-gray-200 scrollbar scrollbar-thumb-indigo-600 scrollbar-track-gray-100" aria-labelledby="dropdownSearchButton">
                    {categories.map((c: any, index: number) => (
                        <li key={index}>
                            <div className="flex items-center">
                                <input id={`checkbox-categories-${c._id}-${r.id}`} type="checkbox" value={c._id} checked={Array.isArray(r.categories) && r.categories.find((cat:any) => cat === c._id ) ? true : false} onChange={(e) => handleRolesCategoriesCheckboxes(e, r.id, c._id)} className="hidden peer" />
                                <label htmlFor={`checkbox-categories-${c._id}-${r.id}`} className="bg-gray-600 w-full text-lg font-medium text-gray-300 peer-checked:bg-indigo-600 p-2 rounded hover:bg-gray-600 mb-1 cursor-pointer transition-all duration-200">
                                    <div className="flex justify-start items-center">
                                    {c.iconUrl ? <img src={c.iconUrl} alt="" className="max-w-[24px] rounded-full mr-2" /> : 
                                    <div className="flex items-center justify-center h-[24px] rounded w-[24px] bg-gray-700 mr-2">
                                    <svg className="w-[24px] h-[24px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                                    </svg>
                                    </div>}
                                    {lang === 'pl' ? c.namePL : c.nameEN}
                                    </div>
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={classNames("bg-gray-900 rounded-2xl my-1 pr-2 flex items-center justify-center cursor-pointer")}>
                <label>
                    <div className={classNames("relative inline-flex items-center my-1 mx-2 select-none", userData.userId && userData.guildMember ? 'cursor-pointer' : null)}>
                        <input type="checkbox" id={r._id} value={r._id} className="sr-only peer" checked={r.isOnDatabase} disabled={!userData.userId || !userData.guildMember ? true : false} onChange={(e) => handleRolesCheckboxes(e, r.id)} />
                        <div className="w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-800 bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-green-600"></div>
                    </div>
                </label>
                <div onClick={() => r.isOnDatabase && !r.toDelete && !rolesState.find(r => r.categoriesDropdownCheckbox) ? handleCategoriesDropdownCheckboxes(r.id) : null} style={{color: r.color}} className="text-base font-medium text-gray-300 select-none pr-2 bg-gray-900">{r.name}</div>
            </div>
        </div>)
      }) : null;

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
        {userData.admin ? <>
        <div className="max-w-[600px] m-auto">
            <h2 className="font-semibold text-2xl text-center w-full pb-4 pt-2">{dictionary['settings-roles']}</h2>
            <label htmlFor="default-search" className="mb-2 text-sm font-medium sr-only text-white">{dictionary.search}</label>
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                    <input ref={searchInputRef} onChange={handleSearchInput} type="search" id="default-search" className="block w-full p-4 pl-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500" />
                    <button onClick={() => searchInputRef.current?.focus()} className="text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-800">{dictionary.search}</button>
            </div>
        </div>

        <div className="max-w-[800px] m-auto bg-gray-700 rounded-xl py-0.5 my-1 max-h-[525px] overflow-y-auto scrollbar scrollbar-thumb-indigo-600 scrollbar-track-gray-100 overflow-x-hidden">
            <div className="m-4 flex flex-wrap justify-around items-center">
                {rolesMap && searchRoles.length > 0 ? rolesMap : <p className="text-lg font-medium">{dictionary["no-roles"]}</p>}
            </div>
        </div>
        </> : null}
    </>)
}
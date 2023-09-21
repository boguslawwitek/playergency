'use client'
import { useState, useEffect, useRef } from "react";
import classNames from "classnames";

interface DashboardRolesProps {
    backendUrl: string,
    lang: 'pl' | 'en',
    roles: any,
    categories: any,
    userData: {
        username: string,
        userId: string,
        avatarUrl: string,
        admin: boolean,
        guildMember: boolean
    },
    dictionary: {
        search: string,
        "category-all": string,
        "not-logged": string,
        "not-guildmember": string,
        "only-owned": string,
        "no-roles": string
    }
}

export default function DashboardRoles({roles, categories, lang, userData, dictionary, backendUrl}:DashboardRolesProps) {
    const [activeCategory, setActiveCategory] = useState('category-all');
    const [rolesState, setRolesState] = useState<any[]>([]);
    const [searchRoles, setSearchRoles] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [onlyOwned, setOnlyOwned] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setRolesState(roles);
        setSearchRoles(roles);
    }, [roles])

    function handleCategoriesRadioInputs(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.value === 'category-all') {
            setActiveCategory(e.target.value);
            
            if(onlyOwned) {
                const rolesFilter = rolesState.filter((r: any) => r.memberHasRole && r.name.toLowerCase().startsWith(searchInput.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            } else {
                const rolesFilter = rolesState.filter((r: any) => r.name.toLowerCase().startsWith(searchInput.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            }
        } else if(categories.find((c: any) => c._id === e.target.value)) {
            setActiveCategory(e.target.value);

            if(onlyOwned) {
                const rolesFilter = rolesState.filter((r: any) => r.memberHasRole && r.categories.find((c: any) => c === e.target.value) && r.name.toLowerCase().startsWith(searchInput.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            } else {
                const rolesFilter = rolesState.filter((r: any) => r.categories.find((c: any) => c === e.target.value) && r.name.toLowerCase().startsWith(searchInput.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            }
        }
    }

    function handleRolesCheckboxes(e: React.ChangeEvent<HTMLInputElement>, roleId: string) {
        const cloneState = [...rolesState];

        if(e.target.checked) {
            fetch(`${backendUrl}/roles/assignRole`, {
                method: "POST",
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({action: "add", role: roleId}),
            });
        } else {
            fetch(`${backendUrl}/roles/assignRole`, {
                method: "POST",
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({action: "remove", role: roleId}),
            });
        }

        const rolesMap = cloneState.map((r: any) => {
            if(r.roleId === roleId) r.memberHasRole = !r.memberHasRole;
            return r;
        })
        setRolesState(rolesMap);
    }

    function handleOnlyOwnedCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
        setOnlyOwned(prev => !prev);

        if(activeCategory === 'category-all') {        
            if(e.target.checked) {
                const rolesFilter = rolesState.filter((r: any) => r.memberHasRole && r.name.toLowerCase().startsWith(searchInput.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            } else {
                const rolesFilter = rolesState.filter((r: any) => r.name.toLowerCase().startsWith(searchInput.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            }
        } else if(categories.find((c: any) => c._id === activeCategory)) {
            if(e.target.checked) {
                const rolesFilter = rolesState.filter((r: any) => r.memberHasRole && r.categories.find((c: any) => c === activeCategory) && r.name.toLowerCase().startsWith(searchInput.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            } else {
                const rolesFilter = rolesState.filter((r: any) => r.categories.find((c: any) => c === activeCategory) && r.name.toLowerCase().startsWith(searchInput.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            }
        }
    }

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchInput(e.target.value);

        if(activeCategory === 'category-all' || !categories || categories.length === 0) {
            if(onlyOwned) {
                const rolesFilter = rolesState.filter((r: any) => r.memberHasRole && r.name.toLowerCase().startsWith(e.target.value.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            } else {
                const rolesFilter = rolesState.filter((r: any) => r.name.toLowerCase().startsWith(e.target.value.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            }
        } else if(categories.find((c: any) => c._id === activeCategory)) {
            if(onlyOwned) {
                const rolesFilter = rolesState.filter((r: any) => r.memberHasRole && r.categories.find((c: any) => c === activeCategory) && r.name.toLowerCase().startsWith(e.target.value.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            } else {
                const rolesFilter = rolesState.filter((r: any) => r.categories.find((c: any) => c === activeCategory) && r.name.toLowerCase().startsWith(e.target.value.trim().toLowerCase()));
                setSearchRoles(rolesFilter);
            }
        }
    }

    const categoriesMap = categories && categories.length > 0 ? categories.map((c: any, index: number) => {
        return (
        <li key={index} className="mx-2">
            <input type="radio" id={`category-${c._id}`} name="categories" value={`${c._id}`} checked={activeCategory === `${c._id}`} className="hidden peer" onChange={handleCategoriesRadioInputs} />
            <label htmlFor={`category-${c._id}`} className="select-none inline-flex items-center justify-between w-full p-1 m-2 border rounded-lg cursor-pointer hover:text-gray-300 border-gray-700 peer-checked:text-indigo-400 peer-checked:border-indigo-500 text-gray-200 bg-gray-700 hover:bg-gray-700">
                <div className="flex w-full justify-center items-center">
                    {c.iconUrl ? <img src={c.iconUrl} alt="" className="max-w-[24px] rounded-full" /> : null}
                    <div className="w-full text-lg font-semibold">{lang === 'pl' ? c.namePL : c.nameEN}</div>
                </div>
            </label>
        </li>
        )
      }) : null;
    
      const rolesMap = rolesState && rolesState.length > 0 ? rolesState.map((r: any, index: number) => {
        return (
            <div key={index} className={classNames("bg-gray-900 rounded-2xl my-1", !searchRoles.find(role => role.roleId === r.roleId) ? 'hidden' : null)}>
                <label className={classNames("relative inline-flex items-center my-1 mx-2 select-none", userData.userId && userData.guildMember ? 'cursor-pointer' : null)}>
                    <input type="checkbox" id={r._id} value={r._id} className="sr-only peer" checked={!userData.userId ? false : r.memberHasRole} disabled={!userData.userId || !userData.guildMember ? true : false} onChange={(e) => handleRolesCheckboxes(e, r.roleId)} />
                    <div className="w-11 h-6 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-800 bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-indigo-600"></div>
                    <span style={{color: r.color}} className="ml-3 text-base font-medium text-gray-300">{r.name}</span>
                </label>
            </div>
        )
      }) : null;

    return (<>
        <div className="max-w-[600px] m-auto">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium sr-only text-white">{dictionary.search}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                    <input ref={searchInputRef} onChange={handleSearchInput} type="search" id="default-search" className="block w-full p-4 pl-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500" />
                    <button onClick={() => searchInputRef.current?.focus()} className="text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-800">{dictionary.search}</button>
            </div>

            {categories && categories.length > 0 ?
            <ul className="flex flex-wrap justify-start items-center w-full text-center pr-4 mt-3 rounded-md">
                <li className="mx-2">
                    <input type="radio" id={`category-all`} name="categories" value={`category-all`} className="hidden peer" defaultChecked={activeCategory === `category-all`} onChange={handleCategoriesRadioInputs} />
                    <label htmlFor={`category-all`} className={classNames("select-none inline-flex items-center justify-between w-full p-1 m-2 border rounded-lg cursor-pointer hover:text-gray-300 border-gray-700 peer-checked:text-indigo-400 peer-checked:border-indigo-500 text-gray-200 bg-gray-700 hover:bg-gray-700", activeCategory === `category-all` ? 'text-indigo-400 border-indigo-500 hover:text-indigo-400' : null)}>
                        <div className="flex w-full justify-center items-center">
                            <div className="w-full text-lg font-semibold">{dictionary["category-all"]}</div>
                        </div>
                    </label>
                </li>
                {categoriesMap}
            </ul> : null}

            {userData.userId && userData.guildMember ? <div className="flex justify-center items-center"><div className={classNames("bg-gray-900 rounded-2xl my-1 pt-2 pb-1 px-2")}>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" value="only-owned" className="sr-only peer" checked={onlyOwned} onChange={handleOnlyOwnedCheckbox} />
                    <div className="w-14 h-7 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all border-gray-600 peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-lg font-medium text-gray-300">{dictionary["only-owned"]}</span>
                </label>
            </div></div> : null}
            
            {userData.userId ? null : <p className="select-none text-center text-indigo-400 text-xl py-2 px-2 font-bold">{dictionary["not-logged"]}</p>}
            {userData.userId && !userData.guildMember ? <p className="select-none text-center text-indigo-400 text-xl py-2 px-2 font-bold">{dictionary["not-guildmember"]}</p> : null}
        </div>

        <div className="max-w-[800px] m-auto bg-gray-700 rounded-xl py-0.5 my-1 max-h-[525px] overflow-auto scrollbar scrollbar-thumb-indigo-600 scrollbar-track-gray-100">
            <div className="m-4 flex flex-wrap justify-around items-center">
                {rolesMap && searchRoles.length > 0 ? rolesMap : <p className="text-lg font-medium">{dictionary["no-roles"]}</p>}
            </div>
        </div>
    </>)
}
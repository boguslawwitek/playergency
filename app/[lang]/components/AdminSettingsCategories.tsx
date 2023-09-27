'use client'
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import useSWR from 'swr';
import { arrayMove, generateRandomString, fetcher } from "../utilsClient";
import { useRouter } from 'next/navigation';

interface AdminSettingsCategoriesProps {
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
        "error-empty-categories": string,
        "done": string,
        loading: string
    }
}

export default function AdminSettingsCategories({dictionary, backendUrl}:AdminSettingsCategoriesProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [categoriesState, setCategoriesState] = useState<any[]>([]);
    const [categoriesStateForDelete, setCategoriesStateForDelete] = useState<any[]>([]);
    const [errorInfo, setErrorInfo] = useState('');
    const [statusInfo, setStatusInfo] = useState('');
    const router = useRouter();
    const { data, error, isLoading } = useSWR(`${backendUrl}/admin/getSettingsRoles`, fetcher);
    const { data:userData, error:userDataError } = useSWR(`${backendUrl}/auth/getUser`, fetcher);

    useEffect(() => {
        if(userData && !userDataError && !userData?.admin) {
            router.push('/');
        }

        if(data && !error && data?.categories.length > 0) {
            setCategories(data.categories);
            setCategoriesState(prev => {
                prev = data.categories.map((c: any) => {
                    return {...c, isNewCategory: false}
                });
    
                return prev;
            });
        }

    }, [userData, router, backendUrl, data, error, userDataError])

    function handleInputs(e: React.ChangeEvent<HTMLInputElement>, name: string, categoryId: string) {
        const cloneState = [...categoriesState];

        const categoriesMap = cloneState.map((c: any) => {
            if(c._id === categoryId) {
                c[name] = e.target.value;
            }
            return c;
        })
        setCategoriesState(categoriesMap);
    }

    function handleChangeIndexBtn(type: string, index: number) {
        const cloneState = [...categoriesState];

        if(type === 'up') {
            if(index > 0) {
                arrayMove(cloneState, index, index - 1);
            }
        } else if(type === 'down') {
            if(index < (cloneState.length - 1)) {
                arrayMove(cloneState, index, index + 1)
            }
        }

        const newCategoriesState = cloneState.map((c: any, index: number) => {
            c.index = index;
            return c;
        });

        setCategoriesState(newCategoriesState);
    }

    function handleDeleteCategory(index: number) {
        const cloneState = [...categoriesState];

        const forDeleteEl: any = cloneState.splice(index, 1);

        if(!forDeleteEl[0].isNewCategory) {
            const cloneForDeleteState = [...categoriesStateForDelete];
            cloneForDeleteState.push(forDeleteEl[0]);
            setCategoriesStateForDelete(cloneForDeleteState);
        }

        const newCategoriesState = cloneState.map((c: any, index: number) => {
            c.index = index;
            return c;
        });

        setCategoriesState(newCategoriesState);
    }

    function handleAddNewCategory() {
        const cloneState = [...categoriesState];
        cloneState.push({iconUrl: '', namePL: '', nameEN: '', index: 0, _id: generateRandomString(), isNewCategory: true});

        const newCategoriesState = cloneState.map((c: any, index: number) => {
            c.index = index;
            return c;
        });

        setCategoriesState(newCategoriesState);
    }

    function handleSubmit() {
        let error = false;
        setErrorInfo('');
        setStatusInfo('');
        

        for(let c of categoriesState) {
            if(!c.namePL || !c.nameEN) {
                error = true;
            }
        }

        if(error) {
            setErrorInfo(dictionary['error-empty-categories']);
            return;
        }

        fetch(`${backendUrl}/admin/updateCategories`, {
            method: "PUT",
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({categories: categoriesState, forDelete: categoriesStateForDelete}),
        }).then(res => {
            setStatusInfo(dictionary.done)

            setTimeout(() => {
                setStatusInfo('');
            }, 5000)
        });
    }

    const categoriesMap = categoriesState && categoriesState.length > 0 ? categoriesState.map((c: any, index: number) => {
        return (
        <li key={index} className="mx-2 flex justify-center items-center flex-col md:flex-row relative">
            <button onClick={() => handleDeleteCategory(index)} className="absolute -top-3 -left-3 group rounded-full w-6 h-6 bg-red-800 flex justify-center items-center cursor-pointer hover:bg-gray-200"><FontAwesomeIcon icon={faXmark} className="text-gray-200 group-hover:text-red-800" /></button>
            <div className="border-gray-700 text-gray-200 bg-gray-700 rounded-lg px-1 mb-3">
                <div className="flex w-full justify-center items-center flex-col md:flex-row">
                    <div className="flex justify-center items-center">
                        {c.iconUrl ? <img src={c.iconUrl} alt="" className="max-w-[24px] rounded-full ml-2" /> : 
                            <div className="flex items-center justify-center h-[24px] rounded w-[24px] bg-gray-700 ml-2">
                            <svg className="w-[24px] h-[24px] text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                            </svg>
                        </div>}
                        <input className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500 ml-2" value={c.iconUrl} onChange={(e) => handleInputs(e, 'iconUrl', c._id)} />
                    </div>
                    <div className="m-2 flex justify-center items-center">PL: <input className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500 ml-2" value={c.namePL} onChange={(e) => handleInputs(e, 'namePL', c._id)} /></div>
                    <div className="m-2 flex justify-center items-center">EN: <input className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500 ml-2" value={c.nameEN} onChange={(e) => handleInputs(e, 'nameEN', c._id)} /></div>
                </div>
            </div>
            <div className="flex justify-center items-center mb-2 md:mb-0">
                <button onClick={() => handleChangeIndexBtn('up', index)} disabled={index === 0 ? true : false} className="ml-2 group rounded-full w-12 h-12 bg-gray-700 flex justify-center items-center cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"><FontAwesomeIcon icon={faAngleUp} className="text-gray-200 group-hover:text-gray-700 group-disabled:pointer-events-none" /></button>
                <button onClick={() => handleChangeIndexBtn('down', index)} disabled={index === (categoriesState.length - 1) ? true : false} className="ml-2 group rounded-full w-12 h-12 bg-gray-700 flex justify-center items-center cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"><FontAwesomeIcon icon={faAngleDown} className="text-gray-200 group-hover:text-gray-700 group-disabled:pointer-events-none" /></button>
            </div>
        </li>
        )
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
        {userData && !userDataError && userData?.admin ? <>
        <h2 className="font-semibold text-2xl text-center w-full pb-4">{dictionary['settings-categories']}</h2>
        <div className="w-full max-w-screen-xl m-auto flex flex-col justify-center items-center mb-4">
            <ul className="flex flex-col justify-start items-center w-full text-center rounded-md m-auto">
                {categoriesMap}
            </ul>
            <div className="flex w-full justify-center items-center">
                <button type="button" onClick={handleAddNewCategory} className="text-white focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 bg-yellow-800 hover:bg-yellow-700 focus:ring-yellow-700 border-yellow-700">{dictionary['add-category']}</button>
                <button type="button" onClick={handleSubmit} className="text-white focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 bg-green-800 hover:bg-green-700 focus:ring-green-700 border-green-700">{dictionary['save-changes']}</button>
            </div>
            {errorInfo ? 
                <div className="flex items-center mt-2 p-4 mb-4 text-md rounded-lg bg-gray-800 text-red-400" role="alert">
                    <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div>
                        {errorInfo}
                    </div>
                </div>
            : null}
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
        </div>
        </> : null}
    </>)
}
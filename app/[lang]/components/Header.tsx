interface HeaderProps {
    dictionary: {
        desc: string,
    }
}

export default function Header({dictionary}:HeaderProps) {
    return (
        <header className="static lg:mb-72"> 
            <div className="bg-[#d00a28] w-full pt-16 px-2">
                <h1 className="bg-[#d00a28] w-full text-center pt-16 pb-4 text-4xl">Playergency</h1>
                <h2 className="bg-[#d00a28] w-full text-center text-xl pb-9">{dictionary.desc}</h2>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="lg:absolute lg:top-50 lg:left-0 lg:z-[-1]">
                <path fill="#D00A28" fillOpacity="1" d="M0,192L80,192C160,192,320,192,480,165.3C640,139,800,85,960,85.3C1120,85,1280,139,1360,165.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
            </svg>
        </header>
    )
}
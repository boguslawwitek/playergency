interface HeaderProps {
    dictionary: {
        desc: string,
    }
}

export default function Header({dictionary}:HeaderProps) {
    return (
        <header className="max-w-[2000px] m-auto pt-[112px] md:pt-[68px] bg-center bg-no-repeat bg-[url('/images/bg.jpg')] bg-gray-500 bg-blend-multiply">
            <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">Playergency</h1>
                <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">{dictionary.desc}</p>
            </div>
        </header>
    )
}
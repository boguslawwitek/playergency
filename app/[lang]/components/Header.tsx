interface HeaderProps {
    dictionary: {
        desc: string,
    }
}

export default function Header({dictionary}:HeaderProps) {
    return (
        <header className="relative max-w-[2000px] m-auto pt-[112px] md:pt-[68px] bg-center bg-no-repeat bg-[url('/images/bg.jpg')] bg-gray-500 bg-blend-multiply">
            <div className="text-gray-700 text-sm absolute bottom-0 right-0 opacity-80 select-none">Image by upklyak on Freepik</div>
            {/* Image by upklyak on Freepik */}
            {/* https://www.freepik.com/free-vector/dangerous-alien-planet-surface-with-rocky-surface_36102402.htm#query=game%20landscape&position=8&from_view=search&track=ais */}
            <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl">Playergency</h1>
                <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">{dictionary.desc}</p>
            </div>
        </header>
    )
}
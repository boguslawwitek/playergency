import { ReactNode } from "react"

interface DashboardContentProps {
    children?: ReactNode
}

export default function DashboardContent({children}: DashboardContentProps) {

    return (
        <div className="md:pl-[256px] pt-[122px] md:pt-[78px] h-full px-3 py-4 overflow-y-auto bg-gray-800">
            {children}
        </div>
    )
}
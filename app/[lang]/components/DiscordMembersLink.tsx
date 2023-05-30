import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

interface DiscordMembersLinkProps {
    members: number,
    dictionary: {
        'discord-btn': string,
        'discord-btn-with-members-1': string,
        'discord-btn-with-members-2': string
    }
}

export default function DiscordMembersLink({dictionary, members}:DiscordMembersLinkProps) {
    return (
        <a href="https://discord.com/invite/85cV6Et" target="_blank" className="text-white focus:outline-none focus:ring-4 rounded-full font-medium px-2 sm:px-6 py-3 text-center mr-2 mb-2 bg-[#5865f2] hover:bg-[#4752c4] focus:ring-[#5865f2] w-fit text-xl mt-9">{members ? <span><FontAwesomeIcon icon={faDiscord} className="mr-3 text-xl" />{dictionary['discord-btn-with-members-1']} {members} {dictionary['discord-btn-with-members-2']}</span> : dictionary["discord-btn"]}</a>
    )
}
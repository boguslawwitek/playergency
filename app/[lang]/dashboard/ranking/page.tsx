import Footer from "../../components/Footer";
import LanguageSwitch from '../../components/LanguageSwitch';
import CooskiesBanner from "../../components/CookiesBanner";
import DashboardNav from '../../components/DashboardNav';
import DashboardContent from "../../components/DashboardContent";
import { getIconUrl, getUser, getRankingTop100 } from "../../utils";
import { getDictionary } from '../../../../dictionary';
import { Locale } from '../../../../i18n-config';
import Link from "next/link";

export default async function DashboardRanking({
    params: { lang },
  }: {
    params: { lang: Locale }
}) {
  const { iconUrl } = await getIconUrl();
  const dictionary = await getDictionary(lang);
  const userData = await getUser();
  const { ranking } = await getRankingTop100();

  const rankingMap = ranking.map((user: any, index: number) => {
    return (<Link href={`/dashboard/profiles/${user.userid}`} key={index}><div className="flex w-full flex-col xl:flex-row justify-between items-center max-w-screen-lg m-auto bg-gray-700 border-gray-600 rounded-lg py-6 px-4 mb-4">
                <div className="flex flex-col xl:flex-row justify-center items-center xl:w-1/5">
                    <div className="text-2xl text-gray-300 mr-4">{user.ranking}.</div>
                    <div className="flex items-center space-x-4 pt-1 xl:pt-0">
                        <img className="w-12 h-12 rounded-full" src={user.avatarUrl} alt={`${user.username} avatar`} />
                        <div className="font-medium text-white text-2xl">
                            <div>{user.shortUsername}</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row items-center justify-center w-full pt-4 xl:pt-0">
                    <div className="text-2xl text-gray-400 px-2 w-fit" style={{color: `${user.levelColor}`}}>{dictionary["user-profile"].level} {user.level}</div>
                    <div className="w-full h-2 mb-4 mt-2 rounded-full bg-gray-800 relative max-w-md xl:max-w-[200px]">
                        <div className="h-2 rounded-full bg-indigo-500" style={{width: `${user.levelPercentOfGoal}%`, backgroundColor: `${user.levelColor}`}}></div>
                    </div>
                </div>
                <div className="flex justify-center items-center text-2xl text-gray-300 font-semibold text-right w-fit">{user.exp}&nbsp;XP</div>
            </div></Link>
    )
  })

  return (<>
    <DashboardNav activeLink="ranking" iconUrl={iconUrl} dictionary={dictionary.nav} backendUrl={String(process.env.backendUrl)} userData={userData} />
    <DashboardContent>
        {ranking ? 
        <div className="min-h-[100vh] px-8 md:px16 py-2 max-w-screen-xl m-auto"> 
            <h2 className="text-4xl font-semibold text-center px-2 pt-4 pb-6">Ranking (Top 100)</h2>
            {rankingMap}
        </div> : 
        <div className="min-h-[100vh] px-8 md:px16 py-2 max-w-screen-xl m-auto">
            <div className="flex items-center flex-col justify-center mt-12">
                <div className="font-medium text-lg">
                    <div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 mr-2 animate-spin text-gray-600 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">{dictionary["user-profile"].loading}...</span>
                    </div>
                </div>
            </div>
        </div>}
    </DashboardContent>
    <CooskiesBanner dictionary={dictionary["cookies-banner"]} />
    <Footer dictionary={dictionary.footer}><LanguageSwitch lang={lang} /></Footer>
  </>)
}
import Footer from "../components/Footer";
import LanguageSwitch from '../components/LanguageSwitch';
import CooskiesBanner from "../components/CookiesBanner";
import DashboardNav from '../components/DashboardNav';
import DashboardContent from "../components/DashboardContent";
import { getIconUrl, getUser } from "../utils";
import { getDictionary } from '../../../dictionary';
import { Locale } from '../../../i18n-config';

export default async function Home({
    params: { lang },
  }: {
    params: { lang: Locale }
}) {
  const { iconUrl } = await getIconUrl();
  const dictionary = await getDictionary(lang);
  const userData = await getUser();

  return (<>
    <DashboardNav activeLink="roles" iconUrl={iconUrl} dictionary={dictionary.nav} backendUrl={String(process.env.backendUrl)} userData={userData} />
    <DashboardContent>
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
                <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
                <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
            </div>
            <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
                <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
            </div>
            <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
                <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
            </div>
        </div>
    </DashboardContent>
    <CooskiesBanner dictionary={dictionary["cookies-banner"]} />
    <Footer dictionary={dictionary.footer}><LanguageSwitch lang={lang} /></Footer>
  </>)
}
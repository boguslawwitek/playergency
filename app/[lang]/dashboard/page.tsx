import Footer from "../components/Footer";
import LanguageSwitch from '../components/LanguageSwitch';
import CooskiesBanner from "../components/CookiesBanner";
import DashboardNav from '../components/DashboardNav';
import DashboardContent from "../components/DashboardContent";
import { getIconUrl, getUser, getDashboardRoles } from "../utils";
import { getDictionary } from '../../../dictionary';
import { Locale } from '../../../i18n-config';
import DashboardRoles from "../components/DashboardRoles";

export default async function Dashboard({
    params: { lang },
  }: {
    params: { lang: Locale }
}) {
  const { iconUrl } = await getIconUrl();
  const dictionary = await getDictionary(lang);
  const userData = await getUser();
  const { roles, categories } = await getDashboardRoles();


  return (<>
    <DashboardNav activeLink="roles" iconUrl={iconUrl} dictionary={dictionary.nav} backendUrl={String(process.env.backendUrl)} userData={userData} />
    <DashboardContent>
        <div className="min-h-[100vh] px-16 py-8 max-w-screen-xl m-auto"> 
            <DashboardRoles lang={lang} roles={roles} categories={categories} userData={userData} dictionary={dictionary["roles-dashboard"]} backendUrl={String(process.env.backendUrl)} />
        </div>
    </DashboardContent>
    <CooskiesBanner dictionary={dictionary["cookies-banner"]} />
    <Footer dictionary={dictionary.footer}><LanguageSwitch lang={lang} /></Footer>
  </>)
}
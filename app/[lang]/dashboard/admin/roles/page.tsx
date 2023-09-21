import Footer from "../../../components/Footer";
import LanguageSwitch from '../../../components/LanguageSwitch';
import CooskiesBanner from "../../../components/CookiesBanner";
import DashboardNav from '../../../components/DashboardNav';
import DashboardContent from "../../../components/DashboardContent";
import { getIconUrl, getUser } from "../../../utils";
import { getDictionary } from '../../../../../dictionary';
import { Locale } from '../../../../../i18n-config';
import AdminSettingsRoles from "../../../components/AdminSettingsRoles";

export default async function DashboardAdmin({
    params: { lang },
  }: {
    params: { lang: Locale }
}) {
  const { iconUrl } = await getIconUrl();
  const dictionary = await getDictionary(lang);
  const userData = await getUser();

  return (<>
    <DashboardNav activeLink="adminRoles" iconUrl={iconUrl} dictionary={dictionary.nav} backendUrl={String(process.env.backendUrl)} userData={userData} />
    <DashboardContent>
    <div className="min-h-[100vh] px-16 py-8 max-w-screen-xl m-auto"> 
            <AdminSettingsRoles lang={lang} userData={userData} dictionary={dictionary["admin-dashboard"]} backendUrl={String(process.env.backendUrl)} />
        </div>
    </DashboardContent>
    <CooskiesBanner dictionary={dictionary["cookies-banner"]} />
    <Footer dictionary={dictionary.footer}><LanguageSwitch lang={lang} /></Footer>
  </>)
}
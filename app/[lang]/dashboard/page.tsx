import Footer from "../components/Footer";
import LanguageSwitch from '../components/LanguageSwitch';
import CooskiesBanner from "../components/CookiesBanner";
import DashboardNav from '../components/DashboardNav';
import DashboardContent from "../components/DashboardContent";
import { getIconUrl, getUser, getDashboardRoles } from "../utils";
import { getDictionary } from '../../../dictionary';
import { Locale } from '../../../i18n-config';
import DashboardRoles from "../components/DashboardRoles";

export async function generateMetadata({ params }:any) {
  if(params.lang === 'pl') {
      return {
          title: 'Playergency | Panel Gracza',
          description: 'Zarządzaj swoim kontem jak nigdy dotąd. Nasz panel to przede wszystkim wygoda.',
          openGraph: {
            title: 'Playergency | Panel Gracza',
            description: 'Zarządzaj swoim kontem jak nigdy dotąd. Nasz panel to przede wszystkim wygoda.',
            images: ['/images/bg.jpg'],
          }
        }
  } else {
      return {
        title: 'Playergency | Player Dashboard',
        description: 'Manage your account like never before. Our panel is all about convenience.',
        openGraph: {
          title: 'Playergency | Player Dashboard',
          description: 'Manage your account like never before. Our panel is all about convenience.',
          images: ['/images/bg.jpg'],
        }
      }
  }
}

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
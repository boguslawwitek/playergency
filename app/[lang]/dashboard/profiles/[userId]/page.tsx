import Footer from "../../../components/Footer";
import LanguageSwitch from '../../../components/LanguageSwitch';
import CooskiesBanner from "../../../components/CookiesBanner";
import DashboardNav from '../../../components/DashboardNav';
import DashboardContent from "../../../components/DashboardContent";
import { getIconUrl, getUser } from "../../../utils";
import { getDictionary } from '../../../../../dictionary';
import { Locale } from '../../../../../i18n-config';
import UserProfile from "../../../components/UserProfile";

export async function generateMetadata({ params }:any) {
  if(params.lang === 'pl') {
      return {
          title: 'Playergency | Profil użytkownika',
        }
  } else {
      return {
          title: 'Playergency | User profile',
      }
  }
}

export default async function DashboardProfile({
    params: { lang },
  }: {
    params: { lang: Locale }
}) {
  const { iconUrl } = await getIconUrl();
  const dictionary = await getDictionary(lang);
  const userData = await getUser();

  return (<>
    <DashboardNav activeLink="profile" iconUrl={iconUrl} dictionary={dictionary.nav} backendUrl={String(process.env.backendUrl)} userData={userData} />
    <DashboardContent>
        <UserProfile lang={lang} dictionary={dictionary["user-profile"]} backendUrl={String(process.env.backendUrl)} />
    </DashboardContent>
    <CooskiesBanner dictionary={dictionary["cookies-banner"]} />
    <Footer dictionary={dictionary.footer}><LanguageSwitch lang={lang} /></Footer>
  </>)
}
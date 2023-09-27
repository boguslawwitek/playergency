import Footer from "../../../components/Footer";
import LanguageSwitch from '../../../components/LanguageSwitch';
import CooskiesBanner from "../../../components/CookiesBanner";
import DashboardNav from '../../../components/DashboardNav';
import DashboardContent from "../../../components/DashboardContent";
import { getIconUrl } from "../../../utils";
import { getDictionary } from '../../../../../dictionary';
import { Locale } from '../../../../../i18n-config';
import UserProfile from "../../../components/UserProfile";
import { Metadata } from 'next';

type Props = {
  params: { lang: string, userId: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const userDataFetch = await fetch(`${process.env.backendUrl}/profile/getUser/${params.userId}`).then((res) => res.json());
  const userData = userDataFetch.userData;
 
  if(params.lang === 'pl') {
    return {
      title: `Playergency | Profil użytkownika ${userData.username}`,
      openGraph: {
        title: `Playergency | Profil użytkownika ${userData.username}`,
        url: `https://www.playergency.com/pl/dashboard/profiles/${userData.userId}`,
        images: [userData.avatarUrl],
      },
    }
  } else {
    return {
      title: `Playergency | User profile ${userData.username}`,
      openGraph: {
        title: `Playergency | User profile ${userData.username}`,
        url: `https://www.playergency.com/en/dashboard/profiles/${userData.userId}`,
        images: [userData.avatarUrl],
      },
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

  return (<>
    <DashboardNav activeLink="profile" iconUrl={iconUrl} dictionary={dictionary.nav} backendUrl={String(process.env.backendUrl)} />
    <DashboardContent>
        <UserProfile lang={lang} dictionary={dictionary["user-profile"]} backendUrl={String(process.env.backendUrl)} />
    </DashboardContent>
    <CooskiesBanner dictionary={dictionary["cookies-banner"]} />
    <Footer dictionary={dictionary.footer}><LanguageSwitch lang={lang} /></Footer>
  </>)
}
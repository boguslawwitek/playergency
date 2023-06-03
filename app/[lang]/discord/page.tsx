import Nav from "../components/Nav";
import Footer from "../components/Footer";
import LanguageSwitch from '../components/LanguageSwitch';
import DiscordMembersLink from "../components/DiscordMembersLink";
import CooskiesBanner from "../components/CookiesBanner";
import { getIconUrl, getMembersCount, getUser } from "../utils";
import { getDictionary } from '../../../dictionary';
import { Locale } from '../../../i18n-config';

export default async function Discord({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
    const { iconUrl } = await getIconUrl();
    const { members } = await getMembersCount();
    const dictionary = await getDictionary(lang);
    const userData = await getUser();

    return (<>
        <Nav iconUrl={iconUrl} dictionary={dictionary.nav} withBackgroundColor={true} backendUrl={String(process.env.backendUrl)} userData={userData} />
        <main className="pt-[112px] md:pt-[68px] max-w-screen-xl m-auto text-center my-6 min-h-[70vh] lg:min-h-[95vh] flex flex-col justify-center items-center">
            <section className="bg-gray-800 flex flex-col justify-center items-center py-8 px-3 w-[80%] sm:w-[600px] max-w-full mx-6 m-auto rounded-3xl border-gray-700 border-2">
                <img src={iconUrl} alt="" className="block w-[128px] sm:w-[250px] max-w-full mb-8" />
                <h1 className="font-semibold text-4xl pb-4">Playergency</h1>
                <p className="text-2xl px-6">{dictionary.discord.desc}</p>
                <DiscordMembersLink members={members} dictionary={dictionary["who-we-are"]} />
            </section>
        </main>
        <CooskiesBanner dictionary={dictionary["cookies-banner"]} />
        <Footer dictionary={dictionary.footer}><LanguageSwitch lang={lang} /></Footer>
      </>)
}
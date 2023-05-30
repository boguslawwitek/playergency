import Nav from "../components/Nav";
import Footer from "../components/Footer";
import LocaleSwitch from '../components/LocaleSwitch';
import DiscordMembersLink from "../components/DiscordMembersLink";
import { getDictionary } from '../../../get-dictionary';
import { Locale } from '../../../i18n-config';
import CooskiesBanner from "../components/CookiesBanner";

async function getIconUrl() {
    const res = await fetch(`${process.env.backendUrl}/discord/getPlayergencyIconUrl`, { next: { revalidate: 10 } });
    return res.json();
}

async function getMembersCount() {
    const res = await fetch(`${process.env.backendUrl}/discord/getPlayergencyMembersCount`, { next: { revalidate: 3 } });
    return res.json();
}

export default async function Discord({
    params: { lang },
  }: {
    params: { lang: Locale }
  }) {

    const dictionary = await getDictionary(lang);
    const { iconUrl } = await getIconUrl();
    const { members } = await getMembersCount();

    return (<>
        <Nav iconUrl={iconUrl} dictionary={dictionary.nav} withBackgroundColor={true} />
        <main className="pt-[68px] max-w-screen-xl m-auto text-center my-6 min-h-[70vh] lg:min-h-[95vh] flex flex-col justify-center items-center">
            <section className="bg-gray-800 flex flex-col justify-center items-center py-8 px-3 w-[80%] sm:w-[600px] max-w-full mx-6 m-auto rounded-3xl border-gray-700 border-2">
                <img src={iconUrl} alt="" className="block w-[128px] sm:w-[250px] max-w-full mb-8" />
                <h1 className="font-semibold text-4xl pb-4">Playergency</h1>
                <p className="text-2xl px-6">{dictionary.discord.desc}</p>
                <DiscordMembersLink members={members} dictionary={dictionary['who-we-are']} />
            </section>
        </main>
        <CooskiesBanner dictionary={dictionary['cookies-banner']} />
        <Footer dictionary={dictionary.footer}><LocaleSwitch lang={lang} /></Footer>
      </>)
}
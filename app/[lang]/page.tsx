import Nav from "./components/Nav";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getDictionary } from '../../get-dictionary';
import { Locale } from '../../i18n-config';
import LocaleSwitch from './components/LocaleSwitch';
import DiscordMembersLink from "./components/DiscordMembersLink";
import CooskiesBanner from "./components/CookiesBanner";

async function getIconUrl() {
  const res = await fetch(`${process.env.backendUrl}/discord/getPlayergencyIconUrl`, { next: { revalidate: 10 } });
  return res.json();
}

async function getMembersCount() {
  const res = await fetch(`${process.env.backendUrl}/discord/getPlayergencyMembersCount`, { next: { revalidate: 3 } });
  return res.json();
}

async function getAdmins() {
  const res = await fetch(`${process.env.backendUrl}/data/getAdmins`, { next: { revalidate: 3 } });
  return res.json();
}

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dictionary = await getDictionary(lang);
  const { iconUrl } = await getIconUrl();
  const { members } = await getMembersCount();
  const { admins } = await getAdmins();

  const adminsElements = admins.map((a: any, index: number) => {
    if(!a.visibilityOnHomepage) return null;

    return (
      <div className="h-[290px] w-full md:w-1/3 max-w-sm border rounded-lg shadow bg-gray-700 border-gray-600 mx-4 my-2" key={index}>
        <div className="flex flex-col items-center pb-8 pt-8">
            <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={a.avatarUrl} alt={`${a.username} avatar`} />
            <h5 className="mb-1 text-xl font-medium text-white">{a.username}</h5>
            <div className="text-sm text-indigo-500 font-semibold mb-1">{lang === 'pl' ? a.rolePL : a.roleEN}</div>
            <div className="text-sm px-4">{lang === 'pl' ? a.descPL : a.descEN}</div>
        </div>
      </div>
    )
  })

  return (<>
    <Nav iconUrl={iconUrl} dictionary={dictionary.nav} />
    <Header dictionary={dictionary.header} />
    <section className="max-w-screen-xl m-auto mt-6">
      <div className="w-full flex flex-col justify-center items-center text-center">
        <p className="text-xl px-3">{dictionary['who-we-are'].desc}</p>
        <DiscordMembersLink members={members} dictionary={dictionary['who-we-are']} />
      </div>
    </section>
    <main className="max-w-screen-xl m-auto text-center">
      <div className="flex flex-col justify-center items-center pt-52 pb-16">
        <h3 className="text-4xl pb-6 font-semibold">{dictionary.homepage["heading-1"]}</h3>
        <img src="/images/gta.png" alt="Grand Theft Auto V" />
        <p className="pt-6 px-9 text-xl">{dictionary.homepage["desc-1"]}</p>
      </div>
      <section className="py-8">
        <h3 className="text-4xl font-semibold">{dictionary.homepage["heading-2"]}</h3>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <img src="/images/csgo.png" alt="Counter Strike" className="w-1/3 md:w-1/5 max-w-full" />
          <p className="text-left px-9 text-xl py-3 md:py-0">{dictionary.homepage["desc-2"]}</p>
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-between items-center border-t-2 border-gray-700">
          <p className="text-left px-9 text-xl py-3 md:py-0">{dictionary.homepage["desc-3"]} <strong>{dictionary.homepage["desc-3-a"]}</strong></p>
          <img src="/images/lol.png" alt="League of Legends" className="w-1/2 md:w-1/3 max-w-full" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center border-t-2 border-gray-700">
          <img src="/images/minecraft.png" alt="Minecraft" className="w-1/2 md:w-1/3 max-w-full" />
          <p className="text-left px-9 text-xl py-3 md:py-0">{dictionary.homepage["desc-4"]}</p>
        </div>
      </section>
      <section className="pb-6">
        <h3 className="text-4xl font-semibold pb-6">{dictionary.homepage["heading-3"]}</h3>
        <div className="flex justify-center items-center flex-wrap">
          {adminsElements}
        </div>
      </section>
    </main>
    <CooskiesBanner dictionary={dictionary['cookies-banner']} />
    <Footer dictionary={dictionary.footer}><LocaleSwitch lang={lang} /></Footer>
  </>)
}
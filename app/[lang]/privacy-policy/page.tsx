import Nav from "../components/Nav";
import Footer from "../components/Footer";
import LocaleSwitch from '../components/LocaleSwitch';
import { getDictionary } from '../../../get-dictionary';
import { Locale } from '../../../i18n-config';
import CooskiesBanner from "../components/CookiesBanner";

async function getIconUrl() {
    const res = await fetch(`${process.env.backendUrl}/discord/getPlayergencyIconUrl`, { next: { revalidate: 10 } });
    return res.json();
}

export default async function PrivacyPolicy({
    params: { lang },
  }: {
    params: { lang: Locale }
  }) {

    const dictionary = await getDictionary(lang);
    const { iconUrl } = await getIconUrl();

    return (<>
        <Nav iconUrl={iconUrl} dictionary={dictionary.nav} withBackgroundColor={true} />
        <section className="pt-[100px] pb-8 max-w-screen-xl m-auto px-2">
            <h1 className="text-4xl font-semibold my-3">{dictionary["privacy-policy"]["heading-1"]}</h1>
            <h2 className="text-3xl font-semibold my-3">{dictionary["privacy-policy"]["heading-2"]}</h2>
                <ol className="list-decimal ml-8 text-lg my-2">
                    <li>{dictionary["privacy-policy"]["point-a-1"]}</li>
                    <li>{dictionary["privacy-policy"]["point-a-2"]}</li>
                </ol>
            <h2 className="text-3xl font-semibold my-3">{dictionary["privacy-policy"]["heading-3"]}</h2>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-b-1"]}</p>
                <ol className="list-decimal ml-8 text-lg my-2">
                    <li>{dictionary["privacy-policy"]["point-b-2"]}</li>
                    <li>{dictionary["privacy-policy"]["point-b-3"]}</li>
                    <li>{dictionary["privacy-policy"]["point-b-4"]}</li>
                    <li>{dictionary["privacy-policy"]["point-b-5"]}</li>
                    <li>{dictionary["privacy-policy"]["point-b-6"]}</li>
                    <li>{dictionary["privacy-policy"]["point-b-7"]}</li>
                    <li>{dictionary["privacy-policy"]["point-b-8"]}</li>
                    <li>{dictionary["privacy-policy"]["point-b-9"]}</li>
                    <li>{dictionary["privacy-policy"]["point-b-10"]}</li>
                </ol>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-b-11"]}</p>
            <h2 className="text-3xl font-semibold my-3">{dictionary["privacy-policy"]["heading-4"]}</h2>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-c-1"]}</p>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-c-2"]}</p>
                <ol className="list-decimal ml-8 text-lg my-2">
                    <li>{dictionary["privacy-policy"]["point-c-3"]}</li>
                    <li>{dictionary["privacy-policy"]["point-c-4"]}</li>
                    <li>{dictionary["privacy-policy"]["point-c-5"]}</li>
                    <li>{dictionary["privacy-policy"]["point-c-6"]}</li>
                    <li>{dictionary["privacy-policy"]["point-c-7"]}</li>
                </ol>
                <p>{dictionary["privacy-policy"]["point-c-8"]}</p>
                <p>{dictionary["privacy-policy"]["point-c-9"]}</p>
            <h2 className="text-3xl font-semibold my-3">{dictionary["privacy-policy"]["heading-5"]}</h2>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-d-1"]}</p>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-d-2"]}</p>
                <ol className="list-decimal ml-8 text-lg my-2">
                    <li>{dictionary["privacy-policy"]["point-d-3"]}</li>
                    <li>{dictionary["privacy-policy"]["point-d-4"]}</li>
                    <li>{dictionary["privacy-policy"]["point-d-5"]}</li>
                    <li>{dictionary["privacy-policy"]["point-d-6"]}</li>
                </ol>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-d-7"]}</p>
            <h2 className="text-3xl font-semibold my-3">{dictionary["privacy-policy"]["heading-6"]}</h2>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-e"]}</p>
            <h2 className="text-3xl font-semibold my-3">{dictionary["privacy-policy"]["heading-7"]}</h2>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-f-1"]}</p>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-f-2"]}</p>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-f-3"]}</p>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-f-4"]}</p>
            <h2 className="text-3xl font-semibold my-3">{dictionary["privacy-policy"]["heading-8"]}</h2>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-g"]}</p>
            <h2 className="text-3xl font-semibold my-3">{dictionary["privacy-policy"]["heading-9"]}</h2>
                <div className="text-xl font-semibold mb-2 underline">{dictionary["privacy-policy"]["point-h-1"]}</div>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-h-2"]}</p>
                <div className="text-xl font-semibold mb-2 underline">{dictionary["privacy-policy"]["point-h-3"]}</div>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-h-4"]}</p>
                <div className="text-xl font-semibold mb-2 underline">{dictionary["privacy-policy"]["point-h-5"]}</div>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-h-6"]}</p>
                <div className="text-xl font-semibold mb-2 underline">{dictionary["privacy-policy"]["point-h-7"]}</div>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-h-8"]}</p>
                <div className="text-xl font-semibold mb-2 underline">{dictionary["privacy-policy"]["point-h-9"]}</div>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-h-10"]}</p>
                <div className="text-xl font-semibold mb-2 underline">{dictionary["privacy-policy"]["point-h-11"]}</div>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-h-12"]}</p>
                <div className="text-xl font-semibold mb-2 underline">{dictionary["privacy-policy"]["point-h-13"]}</div>
                <p className="mb-2 text-lg">{dictionary["privacy-policy"]["point-h-14"]}</p>
                <div className="text-xl font-semibold mb-2 underline">{dictionary["privacy-policy"]["point-h-15"]}</div>
                <div className="text-xl font-semibold mb-2 underline">{dictionary["privacy-policy"]["point-h-16"]}</div>
        </section>
        <CooskiesBanner dictionary={dictionary['cookies-banner']} />
        <Footer dictionary={dictionary.footer}><LocaleSwitch lang={lang} /></Footer>
    </>)
}
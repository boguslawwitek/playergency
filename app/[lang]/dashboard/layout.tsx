import '../globals.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { getIconUrl } from '../utils';

export async function generateMetadata() {
  const { iconUrl } = await getIconUrl();
 
  return {
    metadataBase: new URL('https://www.playergency.com'),
    alternates: {
      canonical: '/',
      languages: {
        'pl-PL': '/pl',
        'en-US': '/en',
      },
    },
    title: 'Playergency',
    icons: {
      icon: iconUrl
    },
    openGraph: {
      images: ['/images/bg.jpg'],
    },
  };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>{children}</div>
  )
}
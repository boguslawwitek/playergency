import { i18n } from '../../i18n-config';
import './globals.css';
import { Inter } from 'next/font/google';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata() {
  const { iconUrl } = await fetch(`${process.env.backendUrl}/discord/getPlayergencyIconUrl`).then((res) => res.json());
 
  return {
    title: 'Playergency',
    icons: {
      icon: iconUrl
    }
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { lang: string }
}) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
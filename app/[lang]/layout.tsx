import './globals.css';
import { Inter } from 'next/font/google';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { getIconUrl } from './utils';

const inter = Inter({ subsets: ['latin'] });

import { i18n } from '../../i18n-config'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

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
    }
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
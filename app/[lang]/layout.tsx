import './globals.css';
import { Inter } from 'next/font/google';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { getIconUrl } from './utils';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata() {
  const { iconUrl } = await getIconUrl();
 
  return {
    metadataBase: new URL('https://www.playergency.com'),
    twitter: {
      card: 'website'
    },
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
      title: 'Playergency',
      images: ['/images/bg.jpg'],
      type: 'website',
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
      <head>
        {process.env.umamiUrl && process.env.umamiDataWebsiteId ?
          <script async src={process.env.umamiUrl} data-website-id={process.env.umamiDataWebsiteId}></script>
        : null}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
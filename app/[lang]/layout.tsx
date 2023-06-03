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
    title: 'Playergency',
    icons: {
      icon: iconUrl
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
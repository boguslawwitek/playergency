import '../globals.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { getIconUrl } from '../utils';

export async function generateMetadata() {
  const { iconUrl } = await getIconUrl();
 
  return {
    title: 'Playergency | Panel Gracza',
    icons: {
      icon: iconUrl
    }
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
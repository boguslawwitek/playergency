import { cookies } from "next/headers";

export async function getIconUrl() {
  const res = await fetch(`${process.env.backendUrl}/discord/getPlayergencyIconUrl`, { next: { revalidate: 60 } });
  return res.json();
}

export async function getMembersCount() {
  const res = await fetch(`${process.env.backendUrl}/discord/getPlayergencyMembersCount`, { next: { revalidate: 60 } });
  return res.json();
}

export async function getAdmins() {
    const res = await fetch(`${process.env.backendUrl}/data/getAdmins`, { next: { revalidate: 60 } });
    return res.json();
}

export async function getUser() {
    const res = await fetch(`${process.env.backendUrl}/auth/getUser`, { cache: 'no-cache', credentials: 'include', headers: {
      Cookie: cookies().getAll().map(({ name, value }) => `${name}=${value}`).join("; ")
    }});
    return res.json();
}
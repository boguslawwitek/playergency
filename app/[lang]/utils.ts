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
  const res = await fetch(`${process.env.backendUrl}/homepage/getAdmins`, { next: { revalidate: 60 } });
  return res.json();
}

export async function getRankingTop100() {
  const res = await fetch(`${process.env.backendUrl}/ranking/top100`, { next: { revalidate: 60 } });
  return res.json();
}

export async function getUser() {
  const res = await fetch(`${process.env.backendUrl}/auth/getUser`, { cache: 'no-store', credentials: 'include', headers: {
    Cookie: cookies().getAll().map(({ name, value }) => `${name}=${value}`).join("; ")
  }});
  return res.json();
}

export async function getDashboardRoles() {
  const res = await fetch(`${process.env.backendUrl}/roles/getDashboardRoles`, { cache: 'no-store', credentials: 'include', headers: {
    Cookie: cookies().getAll().map(({ name, value }) => `${name}=${value}`).join("; ")
  }});
  return res.json();
}
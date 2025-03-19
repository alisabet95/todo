import Image from "next/image";
import HomeAu from "./authen.jsx";
import Link from "next/link.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const name = session && session.user.username;
  return <HomeAu name={name} />;
}

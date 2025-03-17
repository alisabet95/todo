import Image from "next/image";
import HomeAu from "./authen.jsx";
import Link from "next/link.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <h1>
        Hello{" "}
        {session &&
          (session.user.username === "unknown"
            ? "Google User"
            : session.user.username)}
      </h1>
      <Link
        className="text-red-400 border-spacing-2 text-lg bg-blue-300 border-x-green-500 p-4"
        href="/api/auth/signout"
      >
        Sign out
      </Link>

      <HomeAu />
    </div>
  );
}

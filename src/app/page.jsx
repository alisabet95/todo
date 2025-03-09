import Image from "next/image";
import HomeAu from "./authen.jsx";
import Link from "next/link.js";

export default function Home() {
  return (
    <div>
      <h1>Hello</h1>

      <HomeAu />
      <Link
        style={{ font: "message-box", fontWeight: "bolder" }}
        className="text-white rounded-lg bg-fuchsia-950 p-3"
        href="/sorting"
      >
        Sorting
      </Link>
    </div>
  );
}

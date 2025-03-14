"use client";

import Link from "next/link";
import { useState } from "react";

export default function Inp({ name, id }) {
  const [msg, setMsg] = useState("nothing");
  const [idd, setId] = useState("ali");
  function handleMsg(e) {
    setMsg(e.target.value);
  }

  return (
    <>
      <input onChange={handleMsg} value={msg} />
      <input onChange={(e) => setId(e.target.value)} value={idd} />
      <Link
        className="bg-black text-blue-100"
        href={`/sorting${name || ""}/${idd}?name=${msg}`}
      >
        Go to {name}
      </Link>
    </>
  );
}

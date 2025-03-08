"use client";
import { useRouter } from "next/navigation";
import ButtonD from "../(material)/button";

export function But() {
  const Router = useRouter();
  return (
    <ButtonD
      className="text-center"
      ph="Ali's Button"
      onClick={() => Router.push("/")}
    />
  );
}

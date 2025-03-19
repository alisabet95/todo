import Image from "next/image";
import HomeAu from "./authen.jsx";
import photo from "../../public/images/ph4.jpg";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const name = session && session.user.username;
  if (session) {
    return (
      <div>
        <header>
          <h1>Hello, how are you {name}?</h1>
        </header>

        <main className="text-center">
          <p>I've made this Web App just for practice</p>
          <figure>
            <Image
              src={photo}
              alt="my photo"
              height="20%"
              width={300}
              className="mx-auto"
              style={{ borderRadius: "50%" }}
            />
            <figcaption style={{ clear: "left" }} className="text-rose-950">
              My photo😀
            </figcaption>
          </figure>
        </main>
      </div>
    );
  }
  return <HomeAu name={name} />;
}

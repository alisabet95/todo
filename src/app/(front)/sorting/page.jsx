import { Suspense } from "react";
import Inp from "./goto";
import Users from "./users";

export default async function Sort({ searchParams }) {
  const { order } = await searchParams;
  const { name } = await searchParams;

  return (
    <>
      <h1>Hello </h1>
      <div style={{ padding: "0 auto" }}>
        <Suspense fallback={<p>Loading</p>}>
          <Users orderS={order} />
        </Suspense>

        <Inp name={name} />
      </div>
    </>
  );
}

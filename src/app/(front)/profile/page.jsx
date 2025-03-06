import FastA from "./fast";

async function ff() {
  try {
    const res = await fetch("http://localhost:8000/items");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export default async function Fa() {
  const names = await ff();
  return (
    <>
      <h1>Hey</h1>
      <ul className="text-center text-black text-4xl">
        {names.map((el, ind) => (
          <li key={ind}>{el.name}</li>
        ))}
      </ul>
      <FastA />
    </>
  );
}

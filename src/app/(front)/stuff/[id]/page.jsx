import Image from "next/image";

const handlePh = async (d) => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/some-photos/${d}`);
    if (!res.ok) {
      throw new Error("Wrong stuff");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default async function Ss({ params }) {
  const { id } = await params;
  {
    if (Number(id) > 5 || Number(id) < 1) {
      return <h1>"WRONG"</h1>;
    }
  }
  const photo = await handlePh(Number(id));
  return (
    <>
      <div>
        <Image src={photo.src} height={500} width={450} alt={photo.title} />
      </div>
    </>
  );
}

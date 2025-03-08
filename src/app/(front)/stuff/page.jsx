import Image from "next/image";
import { But } from "./butan";
import Photos from "./photos";
import { Stuff, Something } from "./stuff";

const photosFetch = async () => {
  const res = await fetch(`http://localhost:3000/api/some-photos`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await res.json();
  return data;
};

export default async function Page() {
  const photos = await photosFetch();
  return (
    <>
      <Something>Ali's Counter Practice</Something>

      {photos.map((photo) => (
        <div key={photo.id} className="flex flex-col items-center">
          <h3 className="mb-2">{photo.title}</h3>{" "}
          {
            <Image
              src={photo.src}
              alt={photo.title}
              height={300}
              width={280}
              className="rounded-md"
            />
          }
        </div>
      ))}
      <Stuff />
      <Photos />
      <div className="text-center">
        <But />
      </div>
    </>
  );
}

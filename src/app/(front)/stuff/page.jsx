import { But } from "./butan";
import Photos from "./photos";
import { Stuff, Something } from "./stuff";

export default function Page() {
  return (
    <>
      <Something>Ali's Counter Practice</Something>

      <Stuff />
      <Photos />
      <div className="text-center">
        <But />
      </div>
    </>
  );
}

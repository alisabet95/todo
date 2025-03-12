import Fetching from "./para";

export default async function Page({ params }) {
  const { id } = await params;
  return <Fetching ids={id} />;
}

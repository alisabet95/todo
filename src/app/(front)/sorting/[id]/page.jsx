export default async function first({ params, searchParams }) {
  const { id } = await params;
  const { name } = await searchParams;
  return (
    <h1>
      hello {id} and {name}
    </h1>
  );
}

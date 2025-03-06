const fetchID = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/items/${id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default async function Sing({ params, searchParams }) {
  const { id } = await params;
  const { name } = await searchParams;
  const user = await fetchID(id);

  return (
    <>
      <h1>{user.name}</h1>
      {name && <p className="text-center">hey {name}</p>}
    </>
  );
}

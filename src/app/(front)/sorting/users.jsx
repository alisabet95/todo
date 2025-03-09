import { sort } from "fast-sort";
import Link from "next/link";

export default async function Users({ orderS }) {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  let users = await res.json();
  users = sort(users).asc(
    orderS === "email" ? (user) => user.email : (user) => user.name
  );

  return (
    <div className="text-center text-black">
      <table className="text-center">
        <thead>
          <tr>
            <th>
              <Link href="/sorting?order=name">User Name</Link>{" "}
            </th>
            <th>
              <Link href="/sorting?order=email">User Mail</Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

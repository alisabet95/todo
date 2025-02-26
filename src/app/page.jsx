import Image from "next/image";

export default function Home() {
  try {
    prisma.$connect();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}

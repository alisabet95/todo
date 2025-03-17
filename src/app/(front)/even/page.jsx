import OddOrEven from "./oddOrEven";
import styles from "./file.module.css";

export const metadata = {
  title: "Odd or Even",
  description: "Check if a number is odd or even",
};

export default function Page() {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 my-0 ${styles.container}`}
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-neutral-950">
        Welcome to the Odd or Even Checker
      </h1>
      <OddOrEven />
    </div>
  );
}

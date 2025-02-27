import Todos from "./todo";

export const metadata = {
  title: "Ali Sabet to-do list",
  description: "this is a to-do app. it belongs to Ali Sabet",
};

export default function Todo() {
  return (
    <>
      <h1>To-Do list</h1>
      <Todos />
    </>
  );
}

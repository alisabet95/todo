"use client";

import { useState } from "react";
export default function Todos() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    if (input.trim() !== "") {
      setTodos([...todos, input]);
      setInput("");
    }
  };

  const delItem = (id) => {
    setTodos(todos.filter((el, ind) => id !== ind));
  };

  const onEnter = (k) => {
    if (k.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <div className="text-center gap-8">
      <ul className="text-slate-900 flex-col flex-1">
        {todos.length !== 0 ? (
          todos.map((el, ind) => (
            <li key={ind}>
              {el}
              <button onClick={() => delItem(ind)}>Delete</button>
            </li>
          ))
        ) : (
          <p>no item</p>
        )}
      </ul>
      <input
        className="text-black text-center"
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={onEnter}
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

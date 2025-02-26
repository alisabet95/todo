"use client";

import { useState, useEffect } from "react";
import ButtonD from "../(material)/button";
import { useRouter } from "next/navigation";

export default function Todos() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const router = useRouter();

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    document.title = "To-Do";
    // Fetch todos from the backend when the component mounts
    const fetchTodos = async () => {
      try {
        const response = await fetch("/api/todos");
        if (response.ok) {
          const data = await response.json();
          setTodos(data);
        } else {
          console.error("Failed to fetch todos");
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  const handleSubmit = async () => {
    if (input.trim() !== "") {
      // Send a POST request to add a new todo
      try {
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: input }),
        });

        if (response.ok) {
          const newTodo = await response.json();
          setTodos([...todos, newTodo]);
          setInput("");
        } else {
          console.error("Failed to create todo");
        }
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }
  };

  const delItem = async (id) => {
    // Remove item from UI (you can also make a DELETE API call if needed)
    setTodos(todos.filter((el, ind) => id !== ind));
  };

  const onEnter = (k) => {
    if (k.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <ul className="text-slate-900 w-1/2">
        {todos.length !== 0 ? (
          todos.map((el, ind) => (
            <li
              key={ind}
              className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded shadow"
            >
              <span>{el.title}</span> {/* Assuming 'title' is a property */}
              <button
                onClick={() => delItem(ind)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition duration-300"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-center">No items</p>
        )}
      </ul>
      <input
        className="text-black text-center w-1/2 p-2 mb-2 border rounded"
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={onEnter}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
      >
        Submit
      </button>
      <ButtonD onClick={() => router.push("/")} ph="Go Home" />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import ButtonD from "../(material)/button";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

export default function Todos() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const router = useRouter();

  // Enhanced debugging
  useEffect(() => {
    console.log("Session Status:", status);
    console.log("Session Data:", session);
    console.log("Cookies:", document.cookie); // Check if next-auth.session-token exists
  }, [status, session]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchTodos = async () => {
        try {
          const response = await fetch("/api/todos", {
            headers: {
              // Try adding the token explicitly if needed
              Authorization: `Bearer ${
                session?.token || session?.accessToken || ""
              }`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setTodos(data);
          } else {
            console.error("Failed to fetch todos:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching todos:", error);
        }
      };
      fetchTodos();
    }
  }, [status]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (input.trim() !== "" && status === "authenticated") {
      try {
        const payload = { title: input };
        console.log("Sending payload:", payload); // Debugging log

        const response = await fetch("/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              session?.token || session?.accessToken || ""
            }`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const newTodo = await response.json();
          setTodos([...todos, newTodo]);
          setInput("");
        } else {
          console.error("Failed to create todo:", await response.text());
        }
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    } else {
      console.error("Please log in to create a todo");
    }
  };

  const delItem = async (id) => {
    if (status === "authenticated") {
      try {
        const response = await fetch("/api/todos", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              session?.token || session?.accessToken || ""
            }`,
          },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          setTodos(todos.filter((todo) => todo.id !== id));
        } else {
          console.error("Failed to delete todo:", await response.text());
        }
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    } else {
      console.error("Please log in to delete a todo");
    }
  };

  const onEnter = (k) => {
    if (k.key === "Enter") {
      handleSubmit();
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated")
    return <h1>Please log in to view todos.</h1>;

  return (
    <div className="flex flex-col items-center gap-8">
      <ul className="text-slate-900 w-1/2">
        {todos.length !== 0 ? (
          todos.map((todo, index) => (
            <li
              key={todo.id}
              className="flex justify-between items-center bg-gray-100 p-2 mb-2 rounded shadow"
            >
              <span className="text-purple-700">
                {index + 1}
                {" -"}
              </span>
              <span>{todo.title}</span>
              <button
                onClick={() => delItem(todo.id)}
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
        placeholder="Add a New Item..."
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

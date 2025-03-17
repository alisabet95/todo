// src/app/page.tsx (or wherever your login page is)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isRegister, setIsRegister] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isRegister) {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("User registered successfully!");
        setIsRegister(false);
      } else {
        alert(data.error);
      }
    } else {
      const res = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        alert(res.error);
      } else {
        router.push("/todo");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const res = await signIn("google", { redirect: false });
    if (res?.error) {
      alert("Google sign-in failed: " + res.error);
    } else {
      router.push("/todo");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl">{isRegister ? "Register" : "Login"}</h1>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setIsRegister(true)}
          className={`p-2 rounded text-black ${
            isRegister ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Register
        </button>
        <button
          onClick={() => setIsRegister(false)}
          className={`p-2 rounded text-black ${
            !isRegister ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Login
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-1/2">
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          className="p-2 border rounded text-black"
          required
        />
        {isRegister && (
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="p-2 border rounded text-black"
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="p-2 border rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          style={{ minWidth: "20%", maxWidth: "40%", margin: "0 auto" }}
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button
        onClick={handleGoogleSignIn}
        className="bg-red-500 text-white p-2 rounded mt-2"
      >
        Sign in with Google
      </button>
    </div>
  );
}

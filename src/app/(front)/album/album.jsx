"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import ButtonD from "../(material)/button";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const fetchPhotos = async (username, setPhotos) => {
  const res = await fetch(`/api/photos/${username}`);
  if (res.ok) {
    const data = await res.json();
    setPhotos(data);
  }
};

const debouncedFetchPhotos = debounce(fetchPhotos, 500);

export default function Album() {
  const { data: session } = useSession();
  const [username, setUsername] = useState(""); // Manual entry for now
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    document.title = "Photo Album";
    if (username) {
      debouncedFetchPhotos(username, setPhotos);
    } else {
      setPhotos([]);
    }
  }, [username]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !username) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);
    formData.append("title", title);

    const res = await fetch("/api/photos/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      setFile(null);
      setTitle("");
      fetchPhotos(username, setPhotos);
    }
  };

  const handleDelete = async (photoId) => {
    const res = await fetch(`/api/photos/delete/${photoId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchPhotos(username, setPhotos);
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-8 p-4">
        <button
          onClick={() => signIn()}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <button
        onClick={() => signOut()}
        className="bg-red-500 text-white p-2 rounded"
      >
        Sign Out
      </button>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 border rounded w-1/2 text-black"
      />
      <form onSubmit={handleUpload} className="flex flex-col gap-4 w-1/2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2 border rounded text-black"
        />
        <input
          type="text"
          placeholder="Photo title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded"
        />
        <ButtonD
          ph="Upload Photo"
          type="submit"
          style={{ textAlign: "center", margin: "0 auto" }}
          className="bg-green-500 text-white p-2 rounded"
        />
      </form>
      <div className="grid grid-cols-2 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="border p-2 rounded">
            <img
              src={photo.url}
              alt={photo.title || "Photo"}
              className="w-full h-auto"
            />
            <p>{photo.title}</p>
            <p>{new Date(photo.uploadedAt).toLocaleDateString()}</p>
            <ButtonD
              style={{ textAlign: "center", margin: "0 auto" }}
              onClick={() => handleDelete(photo.id)}
              className="bg-red-500 text-white p-2 rounded mt-2 text-center"
              ph="Delete"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
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
  if (!username) return;
  const res = await fetch(`/api/photos/${username}`);
  if (res.ok) {
    const data = await res.json();
    setPhotos(data);
  } else {
    console.error("Failed to fetch photos:", await res.text());
  }
};

const debouncedFetchPhotos = debounce(fetchPhotos, 500);

export default function Album() {
  const { data: session, status } = useSession();
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Debugging session data

  // Fetch photos when session is authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.username) {
      debouncedFetchPhotos(session.user.username, setPhotos);
    } else {
      setPhotos([]);
    }
  }, [status, session]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !session?.user?.username) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", session.user.username); // Use session.user.username
    formData.append("title", title);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/photos/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        setFile(null);
        setTitle("");
        setUploadProgress(0);
        fetchPhotos(session.user.username, setPhotos); // Use session.user.username
      } else {
        console.error("Upload failed:", xhr.statusText);
      }
    };

    xhr.onerror = () => {
      console.error("Upload failed.");
    };

    xhr.send(formData);
  };

  const handleDelete = async (photoId) => {
    const res = await fetch(`/api/photos/delete/${photoId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchPhotos(session.user.username, setPhotos); // Use session.user.username
    } else {
      console.error("Failed to delete photo:", await res.text());
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

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
      <h2 className="text-black">
        Welcome,{" "}
        <span
          style={{
            color: session.user.username === "parisajoon" ? "red" : "black",
          }}
        >
          {session.user.username === "parisajoon" && "parisa joone Ali"}
          {session.user.username === "unknown"
            ? "Google user"
            : session.user.username}
        </span>
        !
      </h2>{" "}
      {/* Use session.user.username */}
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
          className="p-2 border rounded text-black text-center"
        />
        <ButtonD
          ph="Upload Photo"
          type="submit"
          style={{ textAlign: "center", margin: "0 auto" }}
          className="bg-green-500 text-white p-2 rounded"
        />
      </form>
      {uploadProgress > 0 && (
        <div className="w-1/2 bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-center text-black">{uploadProgress}%</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="border p-2 rounded">
            <img
              src={photo.url}
              alt={photo.title || "Photo"}
              className="w-full h-auto"
            />
            <p>{photo.title || "No title"}</p>
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

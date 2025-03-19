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

  // Fetch photos when session is authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.username) {
      debouncedFetchPhotos(session.user.username, setPhotos);
    } else {
      setPhotos([]);
    }
  }, [status, session]);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !session?.user?.username) return;

    // Check File Size (Prevent Large Uploads)
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 10MB. Please upload a smaller file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", session.user.username);
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
        fetchPhotos(session.user.username, setPhotos);
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
      fetchPhotos(session.user.username, setPhotos);
    } else {
      console.error("Failed to delete photo:", await res.text());
    }
  };

  if (status === "loading") {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!session) {
    return (
      <div style={styles.container}>
        <button onClick={() => signIn()} style={styles.signInButton}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={() => signOut()} style={styles.signOutButton}>
        Sign Out
      </button>
      <h2 style={styles.welcomeMessage}>
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
      </h2>
      <form onSubmit={handleUpload} style={styles.form}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Photo title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <ButtonD ph="Upload Photo" type="submit" style={styles.uploadButton} />
      </form>
      {uploadProgress > 0 && (
        <div style={styles.progressBarContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${uploadProgress}%`,
            }}
          ></div>
          <p style={styles.progressText}>{uploadProgress}%</p>
        </div>
      )}
      <div style={styles.photoGrid}>
        {photos.map((photo) => (
          <div key={photo.id} style={styles.photoCard}>
            <img
              src={photo.url}
              alt={photo.title || "Photo"}
              style={styles.photo}
            />
            <p style={styles.photoTitle}>{photo.title || "No title"}</p>
            <p style={styles.photoDate}>
              {new Date(photo.uploadedAt).toLocaleDateString()}
            </p>
            <ButtonD
              onClick={() => handleDelete(photo.id)}
              style={styles.deleteButton}
              ph="Delete"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "24px",
  },
  signInButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
  },
  signOutButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
  },
  welcomeMessage: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  uploadButton: {
    backgroundColor: "#10b981",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    fontSize: "16px",
    textAlign: "center",
    margin: "0 auto",
  },
  progressBarContainer: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#e5e7eb",
    borderRadius: "8px",
    height: "24px",
    marginBottom: "16px",
  },
  progressBar: {
    backgroundColor: "#3b82f6",
    height: "100%",
    borderRadius: "8px",
  },
  progressText: {
    textAlign: "center",
    color: "#333",
    marginTop: "8px",
  },
  photoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    width: "100%",
    maxWidth: "1200px",
  },
  photoCard: {
    border: "1px solid #ccc",
    padding: "16px",
    borderRadius: "8px",
    textAlign: "center",
  },
  photo: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  photoTitle: {
    fontWeight: "bold",
    marginTop: "8px",
  },
  photoDate: {
    color: "#6b7280",
    marginTop: "4px",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    marginTop: "8px",
    textAlign: "center",
    margin: "0 auto",
  },
};

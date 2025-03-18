"use client";
import { useState } from "react";

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/new-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, { sender: "AI", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "AI", text: "Error: " + data.error },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "Request failed." },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={msg.sender === "You" ? styles.userMessage : styles.aiMessage}
          >
            <p>
              <strong>{msg.sender}:</strong> {msg.text}
            </p>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button style={styles.button} onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  },
  chatBox: {
    height: "400px",
    overflowY: "auto",
    border: "1px solid #ccc",
    padding: "16px",
    marginBottom: "16px",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  userMessage: {
    textAlign: "right",
    marginBottom: "8px",
    padding: "8px",
    borderRadius: "8px",
    backgroundColor: "#e0f7fa",
  },
  aiMessage: {
    textAlign: "left",
    marginBottom: "8px",
    padding: "8px",
    borderRadius: "8px",
    backgroundColor: "#ffebee",
  },
  inputContainer: {
    display: "flex",
  },
  input: {
    flexGrow: 1,
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginRight: "8px",
    fontSize: "16px",
  },
  button: {
    padding: "12px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

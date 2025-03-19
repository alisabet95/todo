"use client";
import React, { useState } from "react";
import ButtonD from "../(material)/button";

export default function OddOrEven() {
  const [number, setNumber] = useState("");
  const [data, setData] = useState(null);

  async function getData() {
    try {
      const res = await fetch(`/api/odd-or?num=${number}`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  const keyDown = (e) => {
    if (e.key === "Enter") {
      getData();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Odd or Even Checker</h1>
        <input
          placeholder="Write a number"
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={styles.input}
          onKeyDown={keyDown}
        />
        <ButtonD onClick={getData} ph="Check" style={styles.button} />
        {data && (
          <p style={styles.result}>
            The Number is:{" "}
            {data.result === "odd" ? (
              <span style={styles.odd}>Odd</span>
            ) : (
              <span style={styles.even}>Even</span>
            )}
            <br />
            Number is:{" "}
            {data.prime === "Prime" ? (
              <span style={styles.prime}>Prime</span>
            ) : (
              <span style={styles.notPrime}>Not Prime</span>
            )}
          </p>
        )}
        {data && data.error && <p style={styles.error}>{data.error}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#3b82f6",
    padding: "16px",
    margin: "0",
  },
  card: {
    backgroundColor: "white",
    padding: "48px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "800px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "32px",
    textAlign: "center",
    color: "#1e40af",
  },
  input: {
    width: "100%",
    padding: "16px",
    marginBottom: "32px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "20px",
    outline: "none",
    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
  },
  button: {
    width: "100%",
    backgroundColor: "#1e40af",
    color: "white",
    padding: "16px",
    borderRadius: "8px",
    fontSize: "20px",
    cursor: "pointer",
    textAlign: "center",
    marginBottom: "32px",
  },
  result: {
    marginTop: "32px",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#10b981",
  },
  odd: {
    color: "#ef4444",
  },
  even: {
    color: "#3b82f6",
  },
  prime: {
    color: "#ef4444",
  },
  notPrime: {
    color: "#3b82f6",
  },
  error: {
    marginTop: "32px",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ef4444",
  },
};

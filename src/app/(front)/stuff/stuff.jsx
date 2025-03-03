"use client";
import React, { useState, useEffect } from "react";
import ButtonD from "../(material)/button";

export function Something({ children }) {
  return (
    <>
      <h1>{children}</h1>
    </>
  );
}

export function Stuff() {
  const [count, setCount] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  const startCounter = () => {
    if (!intervalId) {
      const newIntervalId = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 1000);
      setIntervalId(newIntervalId);
    }
  };

  const stopCounter = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  return (
    <div className="my-5">
      <p className="text-center text-black text-3xl">{count}</p>
      <div
        className="mt-5"
        style={{ display: "flex", justifyContent: "space between" }}
      >
        <ButtonD onClick={startCounter} ph="Start" />
        <ButtonD onClick={() => setCount(0)} ph="Reset" />
        <ButtonD
          onClick={stopCounter}
          ph="Stop"
          style={{ marginLeft: "10px" }}
        />
      </div>
    </div>
  );
}

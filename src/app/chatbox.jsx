// components/Chatbot.js (or Chatbot.jsx)

"use client"; // Make sure it's a client component

import React from "react";

const Chatbot = () => {
  return (
    <iframe
      height="430"
      width="350"
      src="https://console.dialogflow.com/api-client/demo/embedded/b4097819-047e-45ea-ac9e-490ec29ff142"
      title="Chatbot" // Add a title for accessibility
      style={{ border: "none" }} // Optional: Remove iframe border
    ></iframe>
  );
};

export default Chatbot;

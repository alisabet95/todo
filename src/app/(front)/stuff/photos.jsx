"use client";

import React, { useState } from "react";
import ButtonD from "../(material)/button";
import Image from "next/image";

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [toggle, setToggle] = useState(false);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/some-photos");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setPhotos(data);
      setToggle(!toggle); // Toggle the state
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="text-center p-5">
      <h2 className="mb-4">My Photos</h2>

      <ButtonD className="mb-4" onClick={fetchPhotos} ph="Fetch Photos" />

      {toggle && (
        <div className="flex flex-wrap justify-center gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="flex flex-col items-center">
              <h3 className="mb-2">{photo.title}</h3>
              <Image
                src={photo.src}
                alt={photo.title}
                height={300}
                width={280}
                className="rounded-md"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

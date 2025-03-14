"use client";
import React, { useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";

const UploadCloud = () => {
  const [publicId, setPublicId] = useState("");

  return (
    <div className="text-center">
      {publicId && (
        <CldImage
          src={publicId}
          className="align-center"
          height={400}
          width={300}
          alt="Uploaded image"
        />
      )}
      <CldUploadWidget
        options={{
          cloudName: "demo",
          sources: ["local", "url", "camera"],
          multiple: false,
          styles: {
            palette: {
              window: "blizzard",
              windowBorder: "#90a0b3",
              tabIcon: "#0078ff",
              menuIcons: "#5a616a",
              textDark: "#000000",
              textLight: "#ffffff",
              link: "#0078ff",
              action: "#ff620c",
              inactiveTabIcon: "#0e2f5a",
              error: "#f44235",
              inProgress: "#0078ff",
              complete: "#20b832",
              sourceBg: "#f4f5f8",
            },
          },
        }}
        uploadPreset="thepreset"
        onSuccess={(result) => {
          console.log("Uploaded Public ID:", result.info.public_id);
          if (result.info && "public_id" in result.info) {
            console.log("Uploaded Public ID:", result.info.public_id);
            setPublicId(result.info.public_id);
          }
        }}
      >
        {({ open }) => (
          <button onClick={() => open()} className="btn btn-primary">
            Upload
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default UploadCloud;

"use client";

import React, { useState } from "react";
import styles from "./pixelgrid.module.css";

function PixelGrid() {
  const [grid, setGrid] = useState(
    Array(10)
      .fill(null)
      .map(() => Array(20).fill("#FFFFFF"))
  );
  const [selectedColor, setSelectedColor] = useState("black");
  const colors = [
    "yellow",
    "blue",
    "green",
    "red",
    "black",
    "white",
    "gray",
    "purple",
    "pink",
    "orange",
    "brown",
    "cyan",
  ];

  const handlePixelClick = (rowIndex, colIndex) => {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = selectedColor;
    setGrid(newGrid);
  };

  return (
    <div className={`${styles.textcenter} my-1`}>
      <div className={styles.grid}>
        {grid.map((row, rowIndex) => (
          <div className={styles.row} key={rowIndex}>
            {row.map((pixelColor, colIndex) => (
              <div
                className={styles.pixel}
                key={colIndex}
                style={{ backgroundColor: pixelColor }}
                onClick={() => handlePixelClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      <p style={{ color: selectedColor, backgroundColor: "black" }}>
        {selectedColor}
      </p>

      <div className={styles.palette}>
        {colors.map((color) => (
          <div
            className={styles.colorOption}
            key={color}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    </div>
  );
}

export default PixelGrid;

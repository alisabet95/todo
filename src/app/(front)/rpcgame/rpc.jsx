"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import React from "react";
import rockPhoto from "@/app/public/images/rock.jpg";
import paperPhoto from "@/app/public/images/paper.jpg";
import scissorsPhoto from "@/app/public/images/sciss.jpg";
import classNames from "classnames";

const choices = [
  { name: "Rock", img: rockPhoto },
  { name: "Paper", img: paperPhoto },
  { name: "Scissors", img: scissorsPhoto },
];

const getRandomChoice = () => {
  const randomInd = Math.floor(Math.random() * choices.length);
  return choices[randomInd];
};

function RockPaper() {
  const [userChoice, setUserChoice] = useState(null);
  const [pcChoice, setPcChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [pcScore, setPcScore] = useState(0);
  const [draw, setDraws] = useState(0);

  const handleUserChoice = (choice) => {
    setUserChoice(choice);
    const randoms = getRandomChoice();
    setPcChoice(randoms);
    if (choice.name === randoms.name) {
      setResult("Draw");
      setDraws((n) => n + 1);
    } else if (
      (choice.name === "Rock" && randoms.name === "Scissors") ||
      (choice.name === "Paper" && randoms.name === "Rock") ||
      (choice.name === "Scissors" && randoms.name === "Paper")
    ) {
      setResult("You Win");
      setPlayerScore((n) => n + 1);
    } else {
      setResult("You Lost");
      setPcScore((n) => n + 1);
    }
  };

  return (
    <div
      className={classNames({
        "bg-slate-400": result === "You Lost",
        "bg-red-600": result === "You Win",
        "text-black": result === "Draw" || "You Lost",
        "text-white": result === "You Win",
      })}
      style={{ textAlign: "center" }}
    >
      <div className="flex justify-center space-x-4 mb-5">
        {choices.map((choice) => (
          <button key={choice.name} onClick={() => handleUserChoice(choice)}>
            <Image
              className="object-contain"
              style={{ height: "170px", width: "170px" }}
              src={choice.img}
              alt={choice.name}
            />
          </button>
        ))}
      </div>
      {userChoice && (
        <div className="item2">
          <h2>
            Your choice:{" "}
            <span style={{ color: "blue" }}>{userChoice.name}</span>
          </h2>
        </div>
      )}

      {pcChoice && (
        <div>
          <h2>
            PC&apos;s Choice:{" "}
            <span style={{ color: "blue" }}>{pcChoice.name}</span>
          </h2>
        </div>
      )}
      {result && (
        <div>
          <h2>Result: {result}</h2>

          <h2>Your score: {playerScore}</h2>
          <h2>Pc Score: {pcScore}</h2>
          <h2>Draws: {draw}</h2>
          <h2>Total: {playerScore + pcScore + draw}</h2>
        </div>
      )}
    </div>
  );
}

export default RockPaper;

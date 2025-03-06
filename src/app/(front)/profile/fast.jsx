"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ButtonD from "../(material)/button";

export default function FastA() {
  const [names, setNames] = useState([]);
  const [searchQ, setSearchQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchApi() {
      try {
        const res = await axios.get("http://localhost:8000/items");

        setNames(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchApi();
  }, []);

  return (
    <>
      <ul className="text-center text-black text-2xl">
        {names &&
          names.map((name, ind) => (
            <li key={ind}>
              {name.name} and {name.id}{" "}
              {
                <ButtonD
                  onClick={() => router.push(`/profile/${name.id}`)}
                  ph="Go to"
                />
              }
            </li>
          ))}
      </ul>
      <div className="text-center">
        <input
          className="text-center text-black"
          type="text"
          onChange={(e) => setSearchQ(e.target.value)}
        />{" "}
        <br />
        <ButtonD
          onClick={() => router.push(`/profile/2?name=${searchQ}`)}
          ph="search"
        />
      </div>
    </>
  );
}

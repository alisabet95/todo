"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  incrementByAmount,
} from "../../store/counterSlice";
import ButtonD from "../(material)/button";

export function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  const [meq, setMeq] = useState(0);

  const handleMeq = (e) => {
    setMeq(e.target.value);
  };

  return (
    <div>
      <button
        aria-label="Increment value"
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
      <span>{count}</span>
      <button
        aria-label="Decrement value"
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </button>
      <input value={meq} onChange={handleMeq} />
      <ButtonD
        onClick={() => dispatch(incrementByAmount(Number(meq)))}
        ph="add or remove"
      />
      <p>{count}</p>
    </div>
  );
}

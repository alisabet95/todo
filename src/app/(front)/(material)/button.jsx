"use client";
import style from "./button.module.css";
export default function ButtonD(props) {
  return (
    <button className={style["default-button"]} onClick={props.onClick}>
      {props.ph}
    </button>
  );
}

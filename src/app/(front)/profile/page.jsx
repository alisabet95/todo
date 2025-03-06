"use client";
import React from "react";
import { Counter } from "./redux";
import { Provider } from "react-redux";
import store from "../../store/store";

export default function Paf() {
  return (
    <>
      <Provider store={store}>
        <Counter />
      </Provider>
    </>
  );
}

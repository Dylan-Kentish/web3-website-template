import React from "react";
import { Data } from "./components/Data";
import { HeaderBar } from "./components/HeaderBar";

export default function App() {
  let data = new Data();

  return (
    <div>
      <HeaderBar data={data} />
    </div>
  );
}
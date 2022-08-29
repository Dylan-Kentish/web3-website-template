import { React } from "react";
import { Data } from "./components/Data";
import { HeaderBar } from "./components/HeaderBar";
import './assets/App.css'

export default function App() {
  const { ethereum } = window;
  let data = null;

  if (ethereum) {
    data = new Data(ethereum);
  }

  return (
    <div>
      <HeaderBar data={data} />
      <div key="content" className="flex items-center flex-col my-5">
      </div>
    </div>
  );
}
import { useState } from "react";

import { abi, contractAddress } from "./constants/constants.js";
import "./App.css";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import MainBody from "./components/MainBody.jsx";
function App() {
  return (
    <>
      <Navbar />
      <Header />
      <MainBody />
    </>
  );
}

export default App;

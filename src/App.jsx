import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Members from "./Pages/Members";
import Meetings from "./Pages/Meetings";
import Payments from "./Pages/Payments";
import Home from "./Pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/members" element={<Members />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

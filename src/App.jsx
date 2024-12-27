import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Members from "./Pages/Members";
import Meetings from "./Pages/Meetings";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/members" element={<Members />} />
          <Route path="/meetings" element={<Meetings />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

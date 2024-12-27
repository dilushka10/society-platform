import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Members from "./Pages/Members";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/members" element={<Members />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

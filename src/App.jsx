import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import React Router components
import Members from "./Pages/Members"; // Ensure this path is correct

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

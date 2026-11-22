import SignUp from "./SignUp";
import LogIn from "./LogIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import "./App.css";
import Home from "./Home";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        theme="dark"
        closeButton
        duration={3000}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
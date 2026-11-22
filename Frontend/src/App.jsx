import SignUp from "./SignUp";
import LogIn from "./LogIn";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import "./App.css";
import Home from "./Home";
import useAuthStore from "./store/useAuthstore.js";

function App() {
  const authUser = useAuthStore((state) => state.authUser);

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
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={authUser ? <Navigate to="/" replace /> : <LogIn />}
        />

        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" replace /> : <SignUp />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
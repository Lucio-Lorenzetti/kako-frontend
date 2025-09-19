import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ConfirmarReserva from "./pages/ConfirmarReserva";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />


        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Confirmación de turno */}
        <Route path="/reservar/:id" element={<ConfirmarReserva />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ReservarTurno from "./pages/ReservarTurno";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />


        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Confirmación de turno */}
        <Route path="/reservar/:id" element={<ReservarTurno />} />
      </Routes>
    </Router>
  );
}

export default App;

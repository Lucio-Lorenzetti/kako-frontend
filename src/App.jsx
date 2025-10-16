import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/User/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ConfirmarReserva from "./pages/User/ConfirmarReserva";

import LoginAdmin from "./pages/Auth/LoginAdmin";
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Reservas from "./pages/Admin/Reservas";
import Usuarios from "./pages/Admin/Usuarios";
import Turnos from "./pages/Admin/Turnos";

import PagoSuccess from "./pages/User/PagoSuccess";
import PagoFailure from "./pages/User/PagoFailure";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Confirmación de turno */}
        <Route path="/reservar/:id" element={<ConfirmarReserva />} />

         {/* Login Admin */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        
        {/* Panel Admin */}
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/reservas" element={<AdminLayout><Reservas /></AdminLayout>} />
        <Route path="/admin/usuarios" element={<AdminLayout><Usuarios /></AdminLayout>} />
        <Route path="/admin/turnos" element={<AdminLayout><Turnos /></AdminLayout>} />


        <Route path="/pago/success" element={<PagoSuccess />} />
        <Route path="/pago/failure" element={<PagoFailure />} />

      </Routes>
    </Router>
  );
}

export default App;

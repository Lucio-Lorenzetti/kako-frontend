import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ConfirmarReserva from "./pages/ConfirmarReserva";
import LoginAdmin from "./pages/Admin/LoginAdmin";
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Reservas from "./pages/Admin/Reservas";
import Usuarios from "./pages/Admin/Usuarios";
import Turnos from "./pages/Admin/Turnos";
import Informes from "./pages/Admin/Informes";
import Configuracion from "./pages/Admin/Configuracion";

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

         {/* Login Admin */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        
        {/* Panel Admin */}
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/reservas" element={<AdminLayout><Reservas /></AdminLayout>} />
        <Route path="/admin/usuarios" element={<AdminLayout><Usuarios /></AdminLayout>} />
        <Route path="/admin/turnos" element={<AdminLayout><Turnos /></AdminLayout>} />
        <Route path="/admin/informes" element={<AdminLayout><Informes /></AdminLayout>} />
        <Route path="/admin/configuracion" element={<AdminLayout><Configuracion /></AdminLayout>} />
      </Routes>
    </Router>
  );
}

export default App;

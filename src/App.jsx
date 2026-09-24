import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/User/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ConfirmarReserva from "./pages/User/ConfirmarReserva";
import Perfil from "./pages/User/Perfil";

import LoginAdmin from "./pages/Auth/LoginAdmin";
import AdminLayout from "./components/Admin/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Reservas from "./pages/Admin/Reservas";
import Usuarios from "./pages/Admin/Usuarios";
import Turnos from "./pages/Admin/Turnos";
import Ayuda from "./pages/Admin/Ayuda";
import PerfilAdmin from "./pages/Admin/Perfil";

import PagoSuccess from "./pages/User/PagoSuccess";
import PagoFailure from "./pages/User/PagoFailure";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Confirmación de turno */}
          <Route path="/reservar/:id" element={<ConfirmarReserva />} />

          {/* Perfil de usuario */}
          <Route path="/perfil" element={<Perfil />} />

           {/* Login Admin */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* Panel Admin */}
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/reservas" element={<AdminLayout><Reservas /></AdminLayout>} />
          <Route path="/admin/usuarios" element={<AdminLayout><Usuarios /></AdminLayout>} />
          <Route path="/admin/turnos" element={<AdminLayout><Turnos /></AdminLayout>} />
          <Route path="/admin/ayuda" element={<AdminLayout><Ayuda /></AdminLayout>} />
          <Route path="/admin/perfil" element={<AdminLayout><PerfilAdmin /></AdminLayout>} />


          <Route path="/pago/success" element={<PagoSuccess />} />
          <Route path="/pago/failure" element={<PagoFailure />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/User/Home"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const ConfirmarReserva = lazy(() => import("./pages/User/ConfirmarReserva"));

const LoginAdmin = lazy(() => import("./pages/Auth/LoginAdmin"));
const AdminLayout = lazy(() => import("./components/Admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const Reservas = lazy(() => import("./pages/Admin/Reservas"));
const Usuarios = lazy(() => import("./pages/Admin/Usuarios"));
const Turnos = lazy(() => import("./pages/Admin/Turnos"));

const PagoSuccess = lazy(() => import("./pages/User/PagoSuccess"));
const PagoFailure = lazy(() => import("./pages/User/PagoFailure"));

function App() {
  return (
    <Router>
      <Suspense fallback={null}>
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
      </Suspense>
    </Router>
  );
}

export default App;

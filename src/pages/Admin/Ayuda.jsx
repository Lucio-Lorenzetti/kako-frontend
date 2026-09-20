import "../../styles/Admin/Ayuda.css";
import "../../styles/Admin/GlobalsAdmin.css";

const secciones = [
  {
    titulo: "Dashboard",
    items: [
      "Ver las reservas de hoy y su detalle: jugadores, WhatsApp, si necesitan paletas y si buscan pareja.",
      "Configurar el precio total y la seña de cada cancha (Interior y Exterior).",
      "Habilitar o deshabilitar cada cancha.",
    ],
  },
  {
    titulo: "Reservas",
    items: [
      "Ver todas las reservas de hoy y los próximos 6 días.",
      "Filtrar por fecha o por cancha.",
      "Consultar usuario, cantidad de jugadores y celular de contacto de cada reserva.",
    ],
  },
  {
    titulo: "Usuarios",
    items: [
      "Buscar usuarios por nombre o apellido.",
      "Cambiar el rol de un usuario (Usuario / Admin).",
      "Activar o desactivar una cuenta.",
      "Eliminar un usuario.",
    ],
  },
  {
    titulo: "Turnos",
    items: [
      "Ver todos los turnos, disponibles, reservados o inactivos.",
      "Filtrar por fecha o por cancha.",
      "Cambiar el estado de un turno manualmente.",
      "Retrasar 30 minutos un horario puntual (por ejemplo, si se atrasa un partido) o devolverlo a su horario original.",
    ],
  },
];

const Ayuda = () => {
  return (
    <div className="ayuda-container">
      <div className="general-card">
        <h2 className="general-title">Ayuda para administradores</h2>
        <p className="general-description">
          Un resumen de todo lo que podés hacer desde el panel.
        </p>
        <div className="ayuda-secciones">
          {secciones.map((s) => (
            <div key={s.titulo} className="ayuda-card">
              <h3>{s.titulo}</h3>
              <ul>
                {s.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ayuda;

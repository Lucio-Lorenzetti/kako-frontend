import "../../styles/User/ComoReservar.css";

const pasos = [
  {
    numero: 1,
    titulo: "Elegí el día y el horario",
    descripcion:
      "Bajá hasta \"Reservá tu turno\" y tocá un horario disponible de la cancha interior.",
  },
  {
    numero: 2,
    titulo: "Iniciá sesión o registrate",
    descripcion:
      "Si todavía no tenés cuenta, te vamos a pedir que te registres. Es rápido y solo hace falta una vez.",
  },
  {
    numero: 3,
    titulo: "Completá los datos de la reserva",
    descripcion:
      "Tu número de WhatsApp, cantidad de jugadores, si necesitás que te prestemos paletas y si buscás pareja de juego.",
  },
  {
    numero: 4,
    titulo: "Pagá la seña",
    descripcion:
      "Confirmá el horario abonando la seña con Mercado Pago.",
  },
  {
    numero: 5,
    titulo: "Confirmá por WhatsApp",
    descripcion:
      "Con el pago acreditado, tocá el botón para enviarnos el resumen de tu reserva por WhatsApp y listo, tu turno queda confirmado.",
  },
];

const ComoReservar = () => {
  return (
    <section id="como-reservar" className="como-reservar-section">
      <h1>¿Cómo reservo mi turno?</h1>
      <p className="como-reservar-subtitulo">
        Todo el proceso, de principio a fin, en 5 pasos.
      </p>
      <div className="pasos-container">
        {pasos.map((p) => (
          <div key={p.numero} className="paso-card">
            <span className="paso-numero">{p.numero}</span>
            <h3>{p.titulo}</h3>
            <p>{p.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComoReservar;

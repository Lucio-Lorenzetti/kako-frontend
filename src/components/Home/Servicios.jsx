import "../../styles/Servicios.css"; 
import Blindex from "../../assets/blindex.jpg";
import Interior from "../../assets/cancha-interior.jpg";
import Vestuario from "../../assets/vestuario.jpg";
import Cantina from "../../assets/cantina.jpg";

const servicios = [
  { 
    nombre: "Cancha Blindex Exterior", 
    descripcion: "Disfrutá partidos únicos en nuestra cancha de blindex al aire libre, con iluminación LED para jugar de día o de noche.", 
    imagen: Blindex 
  },
  { 
    nombre: "Cancha Interior", 
    descripcion: "Jugá sin preocuparte por el clima en nuestra cancha techada, ideal para entrenar y competir en cualquier momento del año.", 
    imagen: Interior 
  },
  { 
    nombre: "Vestuario", 
    descripcion: "Espacios cómodos con lockers y duchas para que te cambies y te relajes antes y después de cada partido.", 
    imagen: Vestuario 
  },
  { 
    nombre: "Cantina", 
    descripcion: "Un espacio pensado para vos: bebidas frías, snacks y un lugar para compartir el tercer tiempo con amigos.", 
    imagen: Cantina 
  },
];

const Servicios = () => {
  return (
    <section id="servicios" style={{ padding: "50px", textAlign: "center" }}>
      <h1>Servicios</h1>
      <div className="servicios-container">
        {servicios.map((s, i) => (
          <div key={i} className="servicio-card">
            <h3>{s.nombre}</h3>
            {s.imagen && <img src={s.imagen} alt={s.nombre} />}
            <p>{s.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Servicios;

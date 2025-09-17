import { useEffect, useState } from "react";
import api from "../../api/api";
import  "../../styles/Reservas.css";

const Reservas = () => {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const { data } = await api.get("/turnos"); // Endpoint que devuelve turnos de la semana
        setTurnos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTurnos();
  }, []);

  return (
    <section id="reservas" className="reservas-section">
      <h2>Reservas</h2>
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
        {turnos.map((t, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: "10px", margin: "5px", width: "120px" }}>
            <p>{t.dia}</p>
            <p>{t.horario}</p>
            <p>{t.disponible ? "Disponible" : "Reservado"}</p>
          </div>
        ))}
      </div>
      <button style={{ marginTop: "20px", padding: "10px 20px" }}>Reservar</button>
    </section>
  );
};

export default Reservas;

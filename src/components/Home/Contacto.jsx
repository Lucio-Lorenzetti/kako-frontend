import "../../styles/User/Contacto.css";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const Contacto = () => {
  return (
    <section id="contacto" className="contacto-section">
      <h1>Contacto</h1>

      <div className="map-container">
        <iframe
          title="Ubicación cancha"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3111.4544563289865!2d-62.26508992425417!3d-38.7532793883151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95eda2d2d224d4cd%3A0x8bdb757675eecad8!2sTarapaca%201845%2C%20B8000%20Bah%C3%ADa%20Blanca%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1758306581284!5m2!1ses!2sar"
          width="600"
          height="450"
          style={{ border: 0, maxWidth: "100%" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      <div className="redes-container">
        <a
          href="https://wa.me/5492914973266?text=Hola%20buenos%20días,%20quisiera%20información%20sobre%20las%20reservas%20de%20cancha."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wp"
        >
          <FaWhatsapp style={{ marginRight: "8px", fontSize: "20px" }} />
          Chatear por WhatsApp
        </a>

        <a
          href="https://www.instagram.com/kakopadel?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ig"
        >
          <FaInstagram style={{ marginRight: "8px", fontSize: "20px" }} />
          Seguinos en Instagram
        </a>
      </div>
    </section>
  );
};

export default Contacto;

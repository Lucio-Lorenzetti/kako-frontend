import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";
import Logo from "../../assets/logo-kako-blanco.png";
import { version } from "../../../package.json";
import "../../styles/User/CopyRight.css";

const WHATSAPP_URL =
  "https://wa.me/5492915024986?text=Hola%20buenos%20días,%20quisiera%20información%20sobre%20las%20reservas%20de%20cancha.";
const INSTAGRAM_URL =
  "https://www.instagram.com/kakopadel?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D";

const CopyRight = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src={Logo} alt="Kako Padel" className="footer-logo" />
          <p className="footer-desc">
            Reservá tu cancha online y disfrutá del pádel en un ambiente
            cercano y comunitario.
          </p>
          <div className="footer-social">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Navegación</h4>
          <a href="#index">Inicio</a>
          <a href="#como-reservar">Cómo Reservar</a>
          <a href="#servicios">Servicios</a>
          <a href="#reservas">Turnos</a>
          <a href="#contacto">Contacto</a>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a>
          <span>Bahía Blanca, Buenos Aires</span>
        </div>

        <div className="footer-col footer-dev">
          <h4>Desarrollo</h4>
          <p className="dev-name">Lucio Lorenzetti</p>
          <p className="dev-role">Ingeniero en Sistemas</p>
          <div className="footer-social">
            <a href="mailto:lorenzettilucioadriel@gmail.com" aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} Kako Padel. Todos los derechos reservados.</span>
        <span>Bahía Blanca &bull; Buenos Aires &bull; Argentina</span>
        <span>v{version}</span>
      </div>
    </footer>
  );
};

export default CopyRight;

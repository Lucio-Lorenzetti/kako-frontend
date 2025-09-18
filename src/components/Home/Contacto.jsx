import "../../styles/Contacto.css";

const Contacto = () => {
  return (
    <section id="contacto" className="contacto-section">
      <h2>Contacto</h2>
      
      <div style={{ marginTop: "20px" }}>
        <iframe
          title="Ubicación cancha"
          src="https://www.google.com/maps/embed?pb=!1m18..."
          width="600"
          height="450"
          style={{ border: 0, maxWidth: "100%" }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      <div className="redes-container">
        <a
          href="https://wa.me/5492914973266"
          target="Hola buenos días, quisiera información sobre las reservas de cancha."
          rel="noopener noreferrer"
          style={{ display: "inline-block", margin: "20px", padding: "10px 20px", background: "#25D366", color: "#fff", borderRadius: "5px" }}
        >
          Chatear por WhatsApp
        </a>
        <a
          href="https://www.instagram.com/kakopadel?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", margin: "20px", padding: "10px 20px", background: "#c164ffff", color: "#fff", borderRadius: "5px" }}
        >
          Seguinos en Instagram
        </a>
      </div>
    </section>
  );
};

export default Contacto;

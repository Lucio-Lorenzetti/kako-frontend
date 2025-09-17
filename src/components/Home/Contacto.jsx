import "../../styles/Contacto.css";

const Contacto = () => {
  return (
    <section id="contacto" className="contacto-section">
      <h2>Contacto</h2>
      <a
        href="https://wa.me/549XXXXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "inline-block", margin: "20px", padding: "10px 20px", background: "#25D366", color: "#fff", borderRadius: "5px" }}
      >
        Chatear por WhatsApp
      </a>
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
    </section>
  );
};

export default Contacto;

import Header from "../../components/Home/Header";
import Index from "../../components/Home/Index";
import Servicios from "../../components/Home/Servicios";
import Reservas from "../../components/Home/Reservas";
import Contacto from "../../components/Home/Contacto";
import CopyRight from "../../components/Home/CopyRight";
import "../../styles/Globals.css"

const Home = () => {
  return (
    <>
      <Header />
      <div style={{ width: "100%"}}>
        <section id="index" className="index-section">
          <Index />
        </section>
        <section id="servicios" className="servicios-section">
          <Servicios />
        </section>
        <section id="reservas" className="reservas-section">
          <Reservas />
        </section>
        <section id="contacto" className="contacto-section">
          <Contacto />
        </section>
        <section id="copyright" className="copyright-section">
          <CopyRight />
        </section>
      </div>
    </>
  );
};

export default Home;

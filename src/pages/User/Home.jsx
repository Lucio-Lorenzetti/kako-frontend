import Header from "../../components/Home/Header";
import Index from "../../components/Home/Index";
import Servicios from "../../components/Home/Servicios";
import Reservas from "../../components/Home/Reservas";
import Contacto from "../../components/Home/Contacto";
import CopyRight from "../../components/Home/CopyRight";
import "../../styles/Globals.css";

const Home = () => {
  return (
    <div className="home-main-container">
      <Header />
      <main>
        <section id="index">
          <Index />
        </section>
        <section id="servicios">
          <Servicios />
        </section>
        <section id="reservas">
          <Reservas />
        </section>
        <section id="contacto">
          <Contacto />
        </section>
      </main>
      <CopyRight />
    </div>
  );
};

export default Home;
import "../../styles/User/Index.css"; // Aquí vamos a poner estilos para el fondo e imagen del logo
import Logo from "../../assets/Logo-Color.png";


const Index = () => {
  return (
    <section id="index" className="index-section">
      <div className="overlay">
        <img src={Logo} alt="Logo cancha" className="logo" />
        <h1 className="bienvenida">¡Bienvenido!</h1>
        <h3>Un espacio deportivo pensado para <br />
        disfrutar del pádel en un ambiente cercano y comunitario.</h3>
      </div>
    </section>
  );
};

export default Index;

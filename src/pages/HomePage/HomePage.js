import "./HomePage.css";
import jpl1 from "../../assets/images/jpl12.png";
import jpl2 from "../../assets/images/jpl22.png";
import jpl3 from "../../assets/images/jpl3.png";
import Navbar from "../../components/Navbar";

const HomePage = () => {
  return (
    <>
      <Navbar/>

      <div className="home-bg">
        <div className="alert alert-success fixed-top" role="alert">
          Registration for JPL Season 6 have started click on{" "}
          <a href="/register" className="alert-link">
            Registration
          </a>
          . Give it a click if you like.
        </div>
        <div
          id="carouselExample"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active mt-5" data-bs-interval="2000">
              <img src={jpl1} className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item mt-5">
              <img src={jpl2} className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item mt-3">
              <img src={jpl3} className="d-block w-100" alt="..." />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
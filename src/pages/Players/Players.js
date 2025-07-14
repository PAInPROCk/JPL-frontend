import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import './Players.css';
import playeImg from "../../assets/images/PlAyer.png"

const Players = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/player_info");
  };
  return (
    <>
      <Navbar />
      <div className="players-bg">
        <div className=" d-flex flex-row">
          <div className="card card-bg me-5" style={{ width: "18rem" }}>
            <img
              src='assets/images/PLayer.png'
              className="img-fluid img-opacity-100% img"
              alt="..."
            />
            <div className="card-body">
              <p className="card-text"></p>
              <button onClick={handleClick} className="btn btn-primary">
                View Info
              </button>
            </div>
          </div>
          <div className="card card-bg me-5" style={{ width: "18rem" }}>
            <img
              src="assets/images/PLayer.png"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <p className="card-text"></p>
              <button onClick={handleClick} className="btn btn-primary">
                View Info
              </button>
            </div>
          </div>
          <div className="card card-bg me-5" style={{ width: "18rem" }}>
            <img
              src="assets/images/PLayer.png"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <p className="card-text"></p>
              <button onClick={handleClick} className="btn btn-primary">
                View Info
              </button>
            </div>
          </div>
          <div className="card card-bg" style={{ width: "18rem" }}>
            <img
              src="assets/images/PLayer.png"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              <p className="card-text"></p>
              <button onClick={handleClick} className="btn btn-primary">
                View Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Players;

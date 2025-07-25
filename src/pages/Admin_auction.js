import NavbarComponent from "../components/Navbar";
import "./Admin_auction.css";
import { useNavigate } from "react-router-dom";
import players from "../pages/Players/PlayerData";
import fallbackImg from "../assets/images/PlAyer.png";

const Admin_auction = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/Sold");
  };
  const player = players[0]; // Temporary: first player for testing

  return (
    <>
      <NavbarComponent />
      <div className="auction-bg d-flex flex-column align-items-center">
        <div className="container auction-container p-4 rounded shadow-lg">
          <div className="container player-info-container shadow p-4 rounded">
            <div className="row g-4">
              <div className="col-md-3 text-center">
                <img
                  src={player.image || fallbackImg}
                  alt={player.name}
                  className="player-image img-fluid"
                  onError={(e) => (e.target.src = fallbackImg)}
                />
              </div>
              <div className="col-md-9">
                <div className="row g-3">
                  <div className="col-md-6 info-box green">
                    <div className="label">Player Name</div>
                    <div className="value">{player.name}</div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <div className="label">Jersey No</div>
                    <div className="value">{player.jersey}</div>
                  </div>
                  <div className="col-md-6 info-box red">
                    <div className="label">Player Category</div>
                    <div className="value">Baller</div>
                  </div>
                  <div className="col-md-6 info-box red">
                    <div className="label">Type</div>
                    <div className="value">Right Hand Spinner</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row text-center mt-2">
              {/* Base & Current Price */}
              <div className="col-md-4 d-flex  align-items-center">
                <div className="p-3 mb-1 rounded bg-light shadow base-price">
                  <strong>Base Price</strong>
                  <p>₹5000</p>
                </div>
                <div className="p-2 ms-3 mb-1 rounded-circle bg-warning shadow current-price">
                  <strong>Current Price</strong>
                  <h4>₹10000</h4>
                </div>
              </div>

              {/* Timer */}
              <div className="col-md-4 d-flex justify-content-center align-items-center">
                <div className="timer bg-warning text-dark p-3 rounded">
                  00 : 00 : 00
                </div>
              </div>

              {/* Auction Control Buttons */}
              <div className="col-md-4 d-flex flex-column align-items-center">
                <div className="quick-bids mb-3">
                  <button
                    className="btn btn-danger m-2 btn-red-custom"
                    onClick={handleClick}
                  >
                    Sold
                  </button>
                  <button className="btn btn-warning m-2 btn-yellow-custom">
                    Pause
                  </button>
                  <button className="btn btn-dark m-2 btn-black-custom">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Notifications */}
          <div className="notifications mt-2 p-3 bg-dark text-white rounded">
            <h5>Notifications</h5>
            <p>Team A bid ₹1000</p>
            <p>Team B bid ₹2000</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin_auction;

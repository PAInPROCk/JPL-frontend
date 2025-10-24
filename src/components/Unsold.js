import "./Unsold.css";
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Unsold = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { player, base_price } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/Admin_auction"); // go back after 10s
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!player) {
  return (
    <div className="bg text-white text-center py-5">
      <h2>No player data available</h2>
      <button
        className="btn btn-light mt-3"
        onClick={() => navigate("/Admin_auction")}
      >
        Back
      </button>
    </div>
  );
}


  return (
    <div className="bg">
      <div className="unsold-page container text-white py-4">
        <div className="row align-items-center">
          {/* Player Image */}
          <div className="col-md-4 text-center">
            <div className="unsold-img-wrapper">
              <img
                src={player.image_path || "../../assets/images/PlAyer.png"}
                alt={player.name}
                className="img-fluid rounded-circle border border-4"
                onError={(e) => (e.target.src = "../../assets/images/PlAyer.png")}
              />
              <div className="unsold-stamp">UNSOLD</div>
            </div>
          </div>

          {/* Player Details */}
          <div className="col-md-8 text-center text-md-start">
            <h1 className="player-name">{player.name}</h1>

            <div className="price-info d-flex flex-column flex-md-row gap-3">
              <div className="price-box bg-dark text-warning p-3 rounded">
                <strong>Base Price:</strong> ₹{base_price}
              </div>
              <div className="price-box bg-dark text-danger p-3 rounded">
                <strong>Status:</strong> UNSOLD
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unsold;

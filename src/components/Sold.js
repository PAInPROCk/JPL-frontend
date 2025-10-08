import "./Sold.css";
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sold = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { player, team_name, base_price, sold_price } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/Admin_auction"); // ✅ Let admin manually decide next player
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!player) return <p>No player data</p>;

  return (
    <div className="bg">
      <div className="sold-page container text-white py-4">
        <div className="row align-items-center">
          {/* Player Image */}
          <div className="col-md-4 text-center">
            <div className="sold-img-wrapper">
              <img
                src={player.image_path || "../../assets/images/PlAyer.png"}
                alt={player.name}
                className="img-fluid rounded-circle border border-4"
                onError={(e) => (e.target.src = "../../assets/images/PlAyer.png")}
              />
              <div className="sold-stamp">SOLD!</div>
            </div>
          </div>

          {/* Player Details */}
          <div className="col-md-8 text-center text-md-start">
            <h1 className="player-name">{player.name}</h1>

            <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-3 mb-3">
              <h5 className="m-0 team-name">TEAM</h5>
              <img
                src="../../assets/images/football-team_16848377.png"
                alt="Team Logo"
                className="team-logo"
              />
              <h4 className="text-info fw-bold m-0">{team_name}</h4>
            </div>

            <div className="price-info d-flex flex-column flex-md-row gap-3">
              <div className="price-box bg-dark text-warning p-3 rounded">
                <strong>Base Price:</strong> ₹{base_price}
              </div>
              <div className="price-box bg-dark text-success p-3 rounded">
                <strong>Sold For:</strong> ₹{sold_price}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sold;

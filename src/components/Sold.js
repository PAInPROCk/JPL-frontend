import "./Sold.css";
import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Sold = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { player, team, base_price, final_bid } = location.state || {};

  // 🔁 Auto redirect after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      axios
        .get(`${API_BASE_URL}/check-auth`, { withCredentials: true })
        .then((res) => {
          const role = res.data.user?.role;
          if (role === "admin") navigate("/Admin_auction");
          else if (role === "team") navigate("/auction");
          else navigate("/");
        })
        .catch(() => navigate("/"));
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!player || !team) return <p className="text-center text-white mt-5">No player data available</p>;

  return (
    <div className="bg sold-page text-white py-4">
      <div className="container">
        <div className="row align-items-center justify-content-center">

          {/* 🧍 Player Section */}
          <div className="col-md-5 text-center mb-4 mb-md-0">
            <div className="player-card bg-dark p-4 rounded-4 shadow-lg">
              <div className="position-relative">
                <img
                  src={`${API_BASE_URL}/${player.image_path}` || "../../assets/images/PlAyer.png"}
                  alt={player.name}
                  className="img-fluid rounded-circle border border-4 border-success mb-3 player-img"
                  onError={(e) => (e.target.src = "../../assets/images/PlAyer.png")}
                />
                <div className="sold-stamp">SOLD</div>
              </div>
              <h2 className="fw-bold">{player.name}</h2>
              <p className="mb-1"><strong>Category:</strong> {player.category}</p>
              <p className="mb-1"><strong>Style:</strong> {player.type}</p>
              <p className="mb-1"><strong>Base Price:</strong> ₹{base_price}</p>
            </div>
          </div>

          {/* 🏆 Team Section */}
          <div className="col-md-5 text-center">
            <div className="team-card bg-dark p-4 rounded-4 shadow-lg">
              <img
                src={`${API_BASE_URL}/${team.team_logo || "uploads/default-team.png"}`}
                alt={team.team_name}
                className="img-fluid rounded-circle border border-4 border-info mb-3 team-img"
                onError={(e) => (e.target.src = "../../assets/images/football-team_16848377.png")}
              />
              <h2 className="fw-bold text-info">{team.team_name}</h2>
              <p className="mb-1"><strong>Final Bid:</strong> ₹{final_bid}</p>
              <p className="mb-1"><strong>Team ID:</strong> {team.team_id}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sold;

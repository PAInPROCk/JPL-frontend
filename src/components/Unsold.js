import "./Unsold.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import fallbackImg from "../assets/images/PlAyer.png";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Unsold = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [player, setPlayer] = useState(location.state?.player || null);
  const [basePrice, setBasePrice] = useState(location.state?.base_price || null);

  // 🧠 If player data missing (e.g. page reloaded), fetch it by ID
  useEffect(() => {
    const loadPlayer = async () => {
      if (!player?.id && location.state?.player?.id) return; // already present
      const playerId = location.state?.player?.id;
      if (!playerId) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/players/${playerId}`, {
          withCredentials: true,
        });
        if (res.data) {
          setPlayer(res.data);
          setBasePrice(res.data.base_price);
        }
      } catch (err) {
        console.error("Failed to fetch player info:", err);
      }
    };
    if (!player) loadPlayer();
  }, [player, location.state]);

  // 🕒 Auto return to auction after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/Admin_auction");
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  // 🧩 If still no player info
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
                src={player.image_path ? `${API_BASE_URL}/${player.image_path}` : fallbackImg}
                alt={player.name}
                className="img-fluid rounded-circle border border-4"
                onError={(e) => (e.target.src = fallbackImg)}
              />
              <div className="unsold-stamp">UNSOLD</div>
            </div>
          </div>

          {/* Player Details */}
          <div className="col-md-8 text-center text-md-start">
            <h1 className="player-name">{player.name}</h1>

            <div className="price-info d-flex flex-column flex-md-row gap-3">
              <div className="price-box bg-dark text-warning p-3 rounded">
                <strong>Base Price:</strong> ₹{basePrice ?? player.base_price}
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

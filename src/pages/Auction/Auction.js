import Navbar from "../../components/Navbar";
import "./Auction.css";
import { useNavigate } from "react-router-dom";
import fallbackImg from "../../assets/images/PlAyer.png";
import { fetchPlayers } from "../Players/PlayerData";
import { useEffect, useState } from "react";

const Auction = () => {
  const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadPlayer = async () =>{
        const data = await fetchPlayers();
        setPlayer(data[0]);
        setLoading(false);
      };
      loadPlayer();
    },[]);
  
    if(loading) return <p>Loading player...</p>;
    if(!player) return <p>No Player found</p>;
  return (
    <>
      <Navbar />
      <div className="auction-bg d-flex flex-column align-items-center">
        <div className="container auction-container p-1 rounded shadow-lg">
          <div className="container player-info-container shadow p-2 rounded">
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
                    <div className="value">{player.category}</div>
                  </div>
                  <div className="col-md-6 info-box red">
                    <div className="label">Type</div>
                    <div className="value">{player.type}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row text-center mt-3">
              {/* Price Section */}
              <div className="col-md-4 d-flex flex-column align-items-center">
                <div className="p-3 mb-1 rounded bg-light shadow base-price">
                  <strong>Base Price</strong>
                  <p>₹5000</p>
                </div>
                <div className="p-3 rounded-circle bg-warning shadow current-price">
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

              {/* Quick Bids + Custom Input */}
              <div className="col-md-4 d-flex flex-column align-items-center">
                <div className="quick-bids mb-1">
                  {["+100", "+500", "+1000", "+2000", "+5000", "+10000"].map(
                    (bid, i) => (
                      <button key={i} className="btn btn-danger m-1 bid-btn">
                        {bid}
                      </button>
                    )
                  )}
                </div>
                <div className="input-group mt-2 w-75">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Custom Price"
                  />
                  <button className="btn btn-success">▶</button>
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

export default Auction;

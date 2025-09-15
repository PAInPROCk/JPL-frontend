import NavbarComponent from "../components/Navbar";
import "./Admin_auction.css";
import { useNavigate } from "react-router-dom";
import fallbackImg from "../assets/images/PlAyer.png";
import { useEffect, useState } from "react";
import axios from "axios";


const Admin_auction = () => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadPlayer = async () => {
    const res = await axios.get("http://localhost:5000/current-auction", {
      withCredentials: true,
    });
    setPlayer(res.data);
  };

  useEffect(() => {
    const checkAuthandLoad = async () => {
      try {
        const authRes = await axios.get("http://localhost:5000/check-auth", {
          withCredentials: true,
        });

        if (!authRes.data.authenticated || authRes.data.role !== "admin") {
          navigate("/");
          return;
        }

        await loadPlayer();
      } catch (err) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    checkAuthandLoad();
  }, [navigate]);

  const handleSold = async () => {
    try {
      await axios.post(
        "http://localhost:5000/end-auction",
        { player_id: player.id },
        { withCredentials: true }
      );
      navigate("/sold", { state: { player } });
    } catch (err) {
      alert("Error marking player as sold");
    }
  };

  const nextPlayer = async () => {
    try {
      await axios
        .post(
          "http://localhost:5000/next-auction",
          { Player_id: player.id + 1 },
          { withCredentials: true }
        )
        .then((res) => console.log(res.data))
        .then((err) => console.log(err));
      await loadPlayer();
    } catch (err) {
      console.error("Error moving to next player", err);
    }
  };

  if (loading) return <p>Loading player...</p>;
  if (!player) return <p>No Player found</p>;

  return (
    <>
      <NavbarComponent />
      <div className="auction-bg d-flex flex-column align-items-center">
        <div className="container auction-container p-4 rounded shadow-lg">
          <div className="container player-info-container shadow p-4 rounded">
            <div className="row g-4">
              <div className="col-md-3 text-center">
                <img
                  src={player.image_path || fallbackImg}
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
                    onClick={handleSold}
                  >
                    Sold
                  </button>
                  <button className="btn btn-warning m-2 btn-yellow-custom">
                    Pause
                  </button>
                  <button className="btn btn-dark m-2 btn-black-custom">
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary m-2 btn-blue-customm"
                    onClick={nextPlayer}
                  >
                    Next Player
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

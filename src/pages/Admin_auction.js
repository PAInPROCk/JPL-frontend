import NavbarComponent from "../components/Navbar";
import "./Admin_auction.css";
import { useNavigate } from "react-router-dom";
import fallbackImg from "../assets/images/PlAyer.png";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

// ✅ Use correct env variable and stable socket connection
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const socket = io(API_BASE_URL, { withCredentials: true });

const Admin_auction = () => {
  const [player, setPlayer] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Load current auction
  const loadPlayer = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/current-auction`, {
        withCredentials: true,
      });

      if (res.data.status === "auction_active") {
        setPlayer(res.data.player);
        setTimeLeft(res.data.remaining_seconds || 0);
        setNotifications(res.data.history || []);
      } else {
        setPlayer(null);
        setTimeLeft(0);
      }
    } catch (err) {
      console.error("Error loading player:", err);
    }
  };

  useEffect(() => {
    const checkAuthandLoad = async () => {
      try {
        const authRes = await axios.get(`${API_BASE_URL}/check-auth`, {
          withCredentials: true,
        });

        if (!authRes.data.authenticated || authRes.data.role !== "admin") {
          navigate("/");
          return;
        }

        await loadPlayer();

        // 🧠 Socket events
        socket.emit("join_auction");

        socket.on("timer_update", (data) => {
          // data can be number or object
          const remaining = typeof data === "number" ? data : data.remaining_seconds;
          setTimeLeft(remaining);
        });

        socket.on("auction_started", (data) => {
          console.log("🏁 Auction started:", data);
          loadPlayer();
        });

        socket.on("auction_ended", (data) => {
          console.log("🏁 Auction ended:", data);
          setTimeLeft(0);
          setPlayer(null);
          if (data.status === "sold") navigate("/sold", { state: data });
          else navigate("/unsold", { state: data });
        });

        socket.on("auction_update", (data) => {
          if (data.player) setPlayer(data.player);
          if (data.highest_bid) {
            setNotifications((prev) => [
              ...prev,
              {
                team: data.highest_bid.team_name,
                amount: data.highest_bid.bid_amount,
              },
            ]);
          }
        });

        socket.on("auction_cleared", () => {
          setPlayer(null);
          setNotifications([]);
          setTimeLeft(0);
        });
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuthandLoad();

    return () => {
      socket.off("auction_update");
      socket.off("auction_started");
      socket.off("auction_ended");
      socket.off("auction_cleared");
      socket.off("timer_update");
    };
  }, [navigate]);

  // ✅ Admin control actions
  const startAuction = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/start-auction`,
        { mode: "random" },
        { withCredentials: true }
      );
      alert(res.data.message);
      loadPlayer();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to start auction");
    }
  };

  const nextPlayer = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/next-auction`,
        {},
        { withCredentials: true }
      );
      if (res.data.status === "auction_moved") loadPlayer();
    } catch (err) {
      console.error("Error moving to next player", err);
    }
  };

  const handleSold = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/end-auction`,
        { player_id: player.id },
        { withCredentials: true }
      );
      navigate("/sold", { state: { player } });
    } catch {
      alert("Error marking player as sold");
    }
  };

  const handlePause = async () => {
    await axios.post(`${API_BASE_URL}/pause-auction`, {}, { withCredentials: true });
  };

  const handleResume = async () => {
    await axios.post(`${API_BASE_URL}/resume-auction`, {}, { withCredentials: true });
  };

  const handleCancel = async () => {
    try {
      await axios.post(`${API_BASE_URL}/cancel-auction`, {}, { withCredentials: true });
      setPlayer(null);
      setTimeLeft(0);
    } catch {
      alert("Error cancelling auction");
    }
  };

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  if (loading) return <p>Loading player...</p>;

  return (
    <>
      <NavbarComponent />
      <div className="auction-bg d-flex flex-column align-items-center">
        <div className="container auction-container mt-2 p-3 rounded shadow-lg">
          {player ? (
            <>
              <div className="container player-info-container shadow p-4 rounded">
                <div className="row g-4">
                  <div className="col-md-3 text-center">
                    <img
                      src={
                        player.image_path
                          ? `${API_BASE_URL}/${player.image_path}`
                          : fallbackImg
                      }
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
                  <div className="col-md-4 d-flex align-items-center">
                    <div className="p-3 mb-1 rounded bg-light shadow base-price">
                      <strong>Base Price</strong>
                      <p>₹{player.base_price}</p>
                    </div>
                    <div className="p-2 ms-3 mb-1 rounded-circle bg-warning shadow current-price">
                      <strong>Current Price</strong>
                      <h4>₹{player.current_bid || player.base_price}</h4>
                    </div>
                  </div>

                  <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <div className="timer bg-warning text-dark p-3 rounded">
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  <div className="col-md-4 d-flex flex-column align-items-center">
                    <div className="quick-bids mb-3">
                      <button className="btn btn-danger m-2" onClick={handleSold}>
                        Sold
                      </button>
                      <button className="btn btn-warning m-2" onClick={handlePause}>
                        Pause
                      </button>
                      <button className="btn btn-success m-2" onClick={handleResume}>
                        Resume
                      </button>
                      <button className="btn btn-dark m-2" onClick={handleCancel}>
                        Cancel
                      </button>
                      <button className="btn btn-primary m-2" onClick={nextPlayer}>
                        Next Player
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="notifications mt-2 p-3 bg-dark text-white rounded">
                <h5>Notifications</h5>
                {notifications.length ? (
                  notifications.map((note, i) => (
                    <p key={i}>
                      {note.team
                        ? `${note.team} bid ₹${note.amount}`
                        : "System Event"}
                    </p>
                  ))
                ) : (
                  <p>No Bids yet</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center">
              <p>No Player Found or Auction Not Started</p>
              <button className="btn btn-success mt-3" onClick={startAuction}>
                Start Auction
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Admin_auction;

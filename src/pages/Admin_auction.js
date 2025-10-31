import NavbarComponent from "../components/Navbar";
import "./Admin_auction.css";
import fallbackImg from "../assets/images/PlAyer.png";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import useSyncedTimer from "../hooks/useSyncedTimer";

// Environment variable fallback
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// Use ref to ensure only one socket instance is created
const useSocket = () => {
  const socketRef = useRef();
  if (!socketRef.current) {
    socketRef.current = io(API_BASE_URL, { withCredentials: true });
  }
  return socketRef.current;
};

const Admin_auction = () => {
  const [player, setPlayer] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [auctionActive, setAuctionActive] = useState(false);

  const navigate = useNavigate();
  const socket = useSocket();

  useSyncedTimer(socket, setTimeLeft);
  // Load auction data
  const loadPlayer = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/current-auction`, {
        withCredentials: true,
      });
      if (res.data.status === "auction_active") {
        setPlayer(res.data.player);
        setTimeLeft(res.data.remaining_seconds || 0);
        setNotifications(res.data.history || []);
        setAuctionActive(true);
      } else {
        setPlayer(null);
        setTimeLeft(0);
        setAuctionActive(false);
      }
    } catch (err) {
      setPlayer(null);
      setTimeLeft(0);
      setAuctionActive(false);
      console.error("Error loading player:", err);
    }
  };

  // Authentication and socket setup
  useEffect(() => {
    let mounted = true;

    try {
      socket.connect();
    } catch (e) {
      console.warn("Socket connection failed:", e);
    }

    const checkAuthAndLoad = async () => {
      try {
        const authRes = await axios.get(`${API_BASE_URL}/check-auth`, {
          withCredentials: true,
        });
        if (!authRes.data.authenticated || authRes.data.role !== "admin") {
          navigate("/");
          return;
        } 
        await loadPlayer();
      

        // Socket events registration
        socket.emit("join_auction", {});

        socket.on("auction_started", (data) => {
          setAuctionActive(true);
          setTimeLeft(data.duration || 0);
          loadPlayer();
        });

        socket.on("auction_ended", (data) => {
          if(!data) return;
          setTimeLeft(0);
          setAuctionActive(null);

          if (data.status === "sold") {
            navigate("/sold", { state: data });
          } else if (data.status === "unsold") {
            navigate("/unsold", {
              state: {
                player: data.player,
                base_price: data.player?.base_price,
                message: data.message,
              },
            });
          }
        });

        socket.on("load_next_player", (data) => {
          nextPlayer(data.player_id);
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
          setAuctionActive(false);
        });
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();

    return () => {
  mounted = false;
  socket.removeAllListeners();
  try {
    socket.disconnect();
  } catch {}
};
    // eslint-disable-next-line
  }, [navigate]);

  // Admin control actions
  const startAuction = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/start-auction`,
        { mode: "random" },
        { withCredentials: true }
      );
      if (res.data.status === "auction_started") {
        setAuctionActive(true);
        await loadPlayer();
      } else {
        alert(res.data.message || "Failed to start auction");
      }
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
    await axios.post(
      `${API_BASE_URL}/pause-auction`,
      {},
      { withCredentials: true }
    );
  };

  const handleResume = async () => {
    await axios.post(
      `${API_BASE_URL}/resume-auction`,
      {},
      { withCredentials: true }
    );
  };

  const handleCancel = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/cancel-auction`,
        {},
        { withCredentials: true }
      );
      setPlayer(null);
      setTimeLeft(0);
      setAuctionActive(false);
    } catch {
      alert("Error cancelling auction");
    }
  };

const formatTime = (seconds) => {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = String(Math.floor(s / 60)).padStart(2, "0");
  const secs = String(s % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

  if (loading) return <p>Loading player...</p>;

  return (
    <>
      <NavbarComponent />
      <div className="auction-bg d-flex flex-column align-items-center">
        <div className="container auction-container mt-1 p-3 rounded shadow-lg">
          {player ? (
            <>
              <div className="container player-info-container shadow p-3 rounded">
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
                        <div className="label">Style</div>
                        <div className="value">{player.type}</div>
                      </div>
                      <div className="col-md-3 stat-box orange">
                        <div className="label">Highest Runs</div>
                        <div className="value">{player.highest_runs}</div>
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
                      <button
                        className="btn btn-danger btn-red-custom m-2"
                        onClick={handleSold}
                      >
                        Sold
                      </button>
                      <button
                        className="btn btn-warning btn-yellow-custom m-2"
                        onClick={handlePause}
                      >
                        Pause
                      </button>
                      <button
                        className="btn btn-success btn-green-custom m-2"
                        onClick={handleResume}
                      >
                        Resume
                      </button>
                      <button
                        className="btn btn-dark m-2"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary m-2"
                        onClick={nextPlayer}
                      >
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
              {/* Only show Start if auction not active */}
              {!auctionActive && (
                <button className="btn btn-success mt-3" onClick={startAuction}>
                  Start Auction
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Admin_auction;

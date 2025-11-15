import NavbarComponent from "../components/Navbar";
import "./Admin_auction.css";
import fallbackImg from "../assets/images/PlAyer.png";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import useSyncedTimer from "../hooks/useSyncedTimer";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// Single socket instance (hook-like)
const useSocket = () => {
  const socketRef = useRef();

  if (!socketRef.current) {
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }

  return socketRef.current;
};

const Admin_auction = () => {
  const [player, setPlayer] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [auctionActive, setAuctionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const navigate = useNavigate();
  const socket = useSocket();

  // Keeps timer in sync with server events
  useSyncedTimer(socket, setTimeLeft, isPaused);

  // Load current auction player from API
  const loadPlayer = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/current-auction`, {
      withCredentials: true,
    });

    if (res.data.status === "auction_active") {
      const p = res.data.player || {};

      // embed correct current bid
      p.current_bid = Number(
        p.current_bid ??
        res.data.currentBid ??
        p.base_price ??
        0
      );

      console.log("🔍 Loaded player:", p);

      setPlayer(p);
      setTimeLeft(res.data.remaining_seconds || 0);
      setNotifications(res.data.history || []);
      setAuctionActive(true);
    } else {
      setPlayer(null);
      setTimeLeft(0);
      setAuctionActive(false);
    }

  } catch (err) {
    console.error("Error loading player:", err);
    setPlayer(null);
    setTimeLeft(0);
    setAuctionActive(false);
  }
};


  // Authentication + socket listeners
  useEffect(() => {
    let mounted = true;

    socket.connect();

    const setup = async () => {
      try {
        const authRes = await axios.get(`${API_BASE_URL}/check-auth`, {
          withCredentials: true,
        });

        if (!authRes.data.authenticated || authRes.data.role !== "admin") {
          navigate("/");
          return;
        }

        await loadPlayer();

        socket.emit("join_auction", {});

        // Auction started
        socket.on("auction_started", (data) => {
          setAuctionActive(true);
          setNotifications([]);
          setTimeLeft(Number(data.time_left ?? data.remaining_seconds ?? 0));
          loadPlayer();
        });

        // Pause
        socket.on("auction_paused", (data) => {
          setIsPaused(true);
          setTimeLeft(Number(data.remaining ?? data.remaining_seconds ?? 0));
        });

        // Resume
        socket.on("auction_resumed", (data) => {
          setIsPaused(false);
          setTimeLeft(Number(data.remaining ?? data.remaining_seconds ?? 0));
        });

        // Auction ended (sold/unsold)
        socket.on("auction_ended", (data) => {
          if (!data) return;

          setTimeLeft(0);
          setAuctionActive(false);

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

        // Next player trigger
        socket.on("load_next_player", () => loadPlayer());

        // MAIN REAL-TIME AUCTION UPDATE
        socket.on("auction_update", (data) => {
          console.log("📡 ADMIN RECEIVED auction_update:", data);

          setTimeLeft(
            Number(
              data.time_left ?? data.remaining_seconds ?? data.remaining ?? 0
            )
          );
          setIsPaused(Boolean(data.paused));

          setPlayer((prev) => {
            const newP = data.player || prev;

            // Clear notifications on new player
            if (prev?.id !== newP?.id) setNotifications([]);

            return {
              ...newP,
              current_bid:
                data.currentBid ?? data.highest_bid?.bid_amount ??
                newP?.base_price ?? 0,
            };
          });

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

        // Bid placed (separate push event)
        socket.on("bid_placed", (payload) => {
          console.log("🔔 ADMIN RECEIVED bid_placed:", payload);

          setPlayer((prev) =>
            prev ? { ...prev, current_bid: payload.bid_amount } : prev
          );

          setNotifications((prev) => [
            ...prev,
            {
              team: payload.team_name,
              amount: payload.bid_amount,
            },
          ]);
        });

        // Auction cleared
        socket.on("auction_cleared", () => {
          setPlayer(null);
          setNotifications([]);
          setTimeLeft(0);
          setAuctionActive(false);
        });
      } catch (err) {
        console.error("Auth setup error:", err);
        navigate("/");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    setup();

    return () => {
      mounted = false;
      socket.removeAllListeners();
      try {
        socket.disconnect();
      } catch (e) {
        // ignore disconnect errors
      }
    };
    // socket is stable (ref), navigate included to avoid stale closure
  }, [navigate]);

  // Admin actions
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
      alert(err.response?.data?.error || "Start failed");
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
      console.error("Next player error:", err);
    }
  };

  const markPlayerAsSold = async (id) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/mark-sold`,
        { player_id: id },
        { withCredentials: true }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to mark SOLD");
    }
  };

  const handlePause = async () => {
    try {
      setIsPaused(true);
      await axios.post(`${API_BASE_URL}/pause-auction`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Pause failed:", err);
      setIsPaused(false);
    }
  };

  const handleResume = async () => {
    try {
      await axios.post(`${API_BASE_URL}/resume-auction`, {}, { withCredentials: true });
      setIsPaused(false);
    } catch (err) {
      console.error("Resume failed:", err);
    }
  };

  const handleCancel = async () => {
    try {
      await axios.post(`${API_BASE_URL}/cancel-auction`, {}, { withCredentials: true });

      setPlayer(null);
      setNotifications([]);
      setTimeLeft(0);
      setAuctionActive(false);
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Cancel failed");
    }
  };

  const formatTime = (seconds) => {
    const s = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = String(Math.floor(s / 60)).padStart(2, "0");
    const secs = String(s % 60).padStart(2, "0");
    return `${mins}:${secs}`;
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
                  {/* PLAYER IMAGE */}
                  <div className="col-md-3 text-center">
                    <img
                      src={player.image_path ? `${API_BASE_URL}/${player.image_path}` : fallbackImg}
                      alt={player.name}
                      className="player-image img-fluid"
                      onError={(e) => (e.target.src = fallbackImg)}
                    />
                  </div>

                  {/* PLAYER DETAILS */}
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

                {/* PRICE + TIMER + CONTROLS */}
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
                    <div className="timer bg-warning text-dark p-3 rounded">{formatTime(timeLeft)}</div>
                  </div>

                  <div className="col-md-4 d-flex flex-column align-items-center">
                    <div className="quick-bids mb-3">
                      <button className="btn btn-danger m-2" onClick={() => markPlayerAsSold(player.id)}>
                        Sold
                      </button>
                      <button className="btn btn-warning m-2" onClick={handlePause} disabled={isPaused || !auctionActive}>
                        Pause
                      </button>
                      <button className="btn btn-success m-2" onClick={handleResume} disabled={!isPaused}>
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

              {/* NOTIFICATIONS */}
              <div className="notifications mt-2 p-3 bg-dark text-white rounded">
                <h5>Notifications</h5>
                {notifications.length ? (
                  notifications.map((note, i) => (
                    <p key={i}>{note.team ? `${note.team} bid ₹${note.amount}` : "System Event"}</p>
                  ))
                ) : (
                  <p>No Bids yet</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center">
              <p>No Player Found or Auction Not Started</p>

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

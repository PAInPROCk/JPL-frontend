import NavbarComponent from "../components/Navbar";
import "./Admin_auction.css";
import fallbackImg from "../assets/images/PlAyer.png";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../src/socket";
import useSyncedTimer from "../hooks/useSyncedTimer";
import { api } from "../Config";
import { API_BASE_URL } from "../Utils/constants";


// Single socket instance (hook-like)


const Admin_auction = () => {
  const [player, setPlayer] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [auctionActive, setAuctionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [flashIndex, setFlashIndex] = useState(null);
  const audioRef = useRef(
    new Audio(
      require("../assets/Sounds/mixkit-software-interface-start-2574.wav")
    )
  );
  const navigate = useNavigate();

  // Keeps timer in sync with server events
  useSyncedTimer(socket, setTimeLeft, isPaused);

  // Load current auction player from API
  const loadPlayer = async () => {
    try {
      const res = await api.get("/current-auction", {
        withCredentials: true,
      });

      if (res.data.status === "auction_active") {
        const p = res.data.player || {};

        // embed correct current bid
        p.current_bid = Number(
          p.current_bid ?? res.data.currentBid ?? p.base_price ?? 0
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

    const setup = async () => {
      try {

        await loadPlayer();

        socket.emit("admin_join", {});
        socket.emit("join_auction");

        socket.on("auction_state", (data) => {
          if (!data) return;

          if (data.status === "auction_active"){
            setPlayer({
              ...data.player,
              current_bid:
               data.highest_bid?.bid_amount ??
               data.player.base_price ??
               0
            });

            setAuctionActive(true);
          }else{
            setPlayer(null);
            setAuctionActive(false);
          }
        });

        socket.on("bid_placed", (data) => {
            setNotifications((prev) => [
              ...prev,
              {
                team_id: data.team_id,
                team_name: data.team_name,
                bid_amount: data.bid_amount,
                bid_time: new Date().toISOString()
              }
            ]);

            setPlayer((prev) => ({
              ...prev,
              current_bid: data.bid_amount
            }));
        });
        // Auction started
        socket.on("auction_started", (data) => {
          setAuctionActive(true);
          setNotifications([]);
          setTimeLeft(Number(data.time_left ?? data.remaining_seconds ?? 0));
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

        // socket.on("load_next_player", (data) => {
        //   nextPlayer();
        // });

        // MAIN REAL-TIME AUCTION UPDATE
        socket.on("auction_update", (data) => {
          if (!data) return;

          // ⏱ timer + pause
          setTimeLeft(Number(data.time_left ?? 0));
          setIsPaused(Boolean(data.paused));
          setAuctionActive(data.status === "auction_active");

          // 👤 player (single source)
          if (data.player) {
            setPlayer({
              ...data.player,
              current_bid:
                data.currentBid ??
                data.highest_bid?.bid_amount ??
                data.player.base_price ??
                0,
              nextSteps: data.nextSteps ?? [],
              teamBalance: data.teamBalance ?? 0,
              canBid: Boolean(data.canBid),
            });
          }

          // 🔔 notifications (single place)
          if (Array.isArray(data.history)) {
            setNotifications((prev) => {
              const prevLast = prev[prev.length - 1];
              const newLast = data.history[data.history.length - 1];

              const isNewBid =
                newLast &&
                (!prevLast ||
                  prevLast.bid_amount !== newLast.bid_amount ||
                  prevLast.team_id !== newLast.team_id ||
                  prevLast.bid_time !== newLast.bid_time);

              if (isNewBid) {
                setFlashIndex(data.history.length - 1);
                try { audioRef.current.play(); } catch { }
                setTimeout(() => setFlashIndex(null), 1500);
              }

              return data.history;
            });
          }
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
      socket.off("auction_started");
      socket.off("auction_paused");
      socket.off("auction_resumed");
      socket.off("auction_ended");
      // socket.off("load_next_player");
      socket.off("auction_update");
      socket.off("bid_placed");
      socket.off("auction_cleared");
    };
    // eslint-disable-next-line
  }, [navigate]);

  useEffect(() => {
    const el = document.querySelector(".notifications");
    if (el) el.scrollTop = el.scrollHeight;
  }, [notifications]);

  // Admin actions
  const startAuction = async () => {
    try {
      const res = await api.post(
        "/start-auction",
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
    if (isPaused) return; // ⛔ prevent clicking while paused

    try {
      const res = await api.post(
        "/next-auction",
        {},
        { withCredentials: true }
      );

      if (res.data.status === "auction_moved") {
        console.log("Next player loaded:", res.data.message);

        // ✅ Backend already emits auction_ended and auction_started
        // So we just reload player to reflect latest data
        await loadPlayer();
      } else if (res.data.sold_status === "sold") {
        // 🔁 Redirect to Sold page (backend triggered sale)
        navigate("/sold", { state: res.data });
      } else if (res.data.sold_status === "unsold") {
        // 🔁 Redirect to Unsold page (backend marked unsold)
        navigate("/unsold", { state: res.data });
      } else {
        alert(res.data.error || "Failed to move to next player");
      }
    } catch (err) {
      console.error("Next player error:", err);
    }
  };

  const markPlayerAsSold = async (id) => {
    try {
      const res = await api.post(
        "/mark-sold",
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
      await api.post(
        "/pause-auction",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Pause failed:", err);
      setIsPaused(false);
    }
  };

  const handleResume = async () => {
    try {
      await api.post(
        "/resume-auction",
        {},
        { withCredentials: true }
      );
      setIsPaused(false);
    } catch (err) {
      console.error("Resume failed:", err);
    }
  };

  const handleCancel = async () => {
    try {
      await api.post(
        "/cancel-auction",
        {},
        { withCredentials: true }
      );

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
                    <div className="timer bg-warning text-dark p-3 rounded">
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  <div className="col-md-4 d-flex flex-column align-items-center">
                    <div className="quick-bids mb-3">
                      <button
                        className="btn btn-danger m-2"
                        onClick={() => markPlayerAsSold(player.id)}
                      >
                        Sold
                      </button>
                      <button
                        className="btn btn-warning m-2"
                        onClick={handlePause}
                        disabled={isPaused || !auctionActive}
                      >
                        Pause
                      </button>
                      <button
                        className="btn btn-success m-2"
                        onClick={handleResume}
                        disabled={!isPaused}
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
                        disabled={isPaused || !auctionActive}
                      >
                        Next Player
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="notifications-container">
                <h5 className="notifications-title">Notifications</h5>

                <div className="notifications-list">
                  {notifications.length ? (
                    notifications.map((note, i) => {
                      const rankClass =
                        i === notifications.length - 1
                          ? "gold"
                          : i === notifications.length - 2
                            ? "silver"
                            : i === notifications.length - 3
                              ? "bronze"
                              : "";

                      return (
                        <p
                          key={i}
                          className={`${flashIndex === i ? "flash" : ""
                            } ${rankClass}`}
                        >
                          🕒 {note.bid_time} — {note.team_name} bid ₹
                          {note.bid_amount}
                        </p>
                      );
                    })
                  ) : (
                    <p>No Bids yet</p>
                  )}
                </div>
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

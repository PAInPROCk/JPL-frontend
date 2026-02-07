import Navbar from "../../components/Navbar";
import "./Auction.css";
import { useNavigate } from "react-router-dom";
import fallbackImg from "../../assets/images/PlAyer.png";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import useSyncedTimer from "../../hooks/useSyncedTimer";
import { api } from "../../Config";
import { API_BASE_URL } from "../../Utils/constants";

// Always use one socket instance
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

const Auction = () => {
  const [auctionData, setAuctionData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [flashIndex, setFlashIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canBid, setCanBid] = useState(false);
  const [teamBalance, setTeamBalance] = useState(0);
  const [nextSteps, setNextSteps] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const navigate = useNavigate();
  const socket = useSocket();
  const audioRef = useRef(
    new Audio(
      require("../../assets/Sounds/mixkit-software-interface-start-2574.wav")
    )
  );

  useSyncedTimer(socket, setTimeLeft, isPaused);

  const teamIdRef = useRef(null);
  const teamNameRef = useRef("Unknown Team");

  // Load initial data (auth + current auction)
  const loadInitial = async () => {
    try {
      setLoading(true);

      const authRes = await api.get("/check-auth", {
        withCredentials: true,
      });
      if (!authRes.data.authenticated) {
        navigate("/");
        return false;
      }

      teamIdRef.current = authRes.data.user?.team_id || null;
      teamNameRef.current = authRes.data.user?.team_name || "Unknown Team";

      const auctionRes = await api.get("/current-auction", {
        withCredentials: true,
      });

      if (auctionRes.data?.status === "auction_active") {
        const data = auctionRes.data;
        setAuctionData(data);
        setNotifications(data.history || []);
        setNextSteps(data.nextSteps || []);
        setTeamBalance(data.teamBalance || 0);
        setCanBid(Boolean(data.canBid));

        const seed =
          data.remaining_seconds || data.time_left || data.timeLeft || 0;
        setTimeLeft(Number(seed));
      } else {
        setAuctionData(null);
      }

      return true;
    } catch (err) {
      console.error("Initial load failed:", err);
      navigate("/");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // SOCKET HANDLERS
  useEffect(() => {
    let mounted = true;
    socket.connect();

    const startRealtime = async () => {
      const ok = await loadInitial();
      if (!ok) return;

      socket.emit("join_auction", {
        team_id: teamIdRef.current,
        team_name: teamNameRef.current,
        purse: teamBalance,
      });

      // MAIN LIVE UPDATE
      socket.on("auction_update", (data) => {
        if (!mounted) return;

        // Reset notifications if new player arrives
        setAuctionData((prev) => {
          if (prev?.player?.id !== data.player?.id) {
            setNotifications([]);
            setFlashIndex(null);
          }
          return data;
        });

        setAuctionData(data);

        setTimeLeft(
          Number(
            data.time_left ?? data.remaining_seconds ?? data.remaining ?? 0
          )
        );

        setIsPaused(Boolean(data.paused));

        // --- notifications & audio (single source of truth) ---
        if (Array.isArray(data.history)) {
          const newHistory = data.history;

          setNotifications((prev) => {
            const prevLast = prev[prev.length - 1];
            const newLast = newHistory[newHistory.length - 1];

            const isNewBid =
              newLast &&
              (!prevLast ||
                prevLast.bid_amount !== newLast.bid_amount ||
                prevLast.team_id !== newLast.team_id ||
                prevLast.bid_time !== newLast.bid_time);

            if (isNewBid) {
              setFlashIndex(newHistory.length - 1);
              try {
                audioRef.current.play();
              } catch {}
              setTimeout(() => setFlashIndex(null), 1500);
            }

            return newHistory; // always trust backend history
          });
        }

        if (typeof data.teamBalance !== "undefined")
          setTeamBalance(data.teamBalance);
        if (typeof data.canBid !== "undefined") setCanBid(data.canBid);

        const MIN_INCREMENT = 500;

        if (data.highest_bid) {
          const current = Number(data.highest_bid.bid_amount) || 0;
          setNextSteps([
            current + MIN_INCREMENT,
            current + MIN_INCREMENT * 2,
            current + MIN_INCREMENT * 3,
          ]);
        } else if (data.player && data.player.base_price) {
          const base = Number(data.player.base_price) || 0;
          setNextSteps([
            base + MIN_INCREMENT,
            base + MIN_INCREMENT * 2,
            base + MIN_INCREMENT * 3,
          ]);
        }
      });

      socket.on("auction_started", (data) => {
        if (!mounted) return;
        setNotifications([]);
        setAuctionData(data);

        const t = Number(data.time_left ?? data.remaining_seconds ?? 0);
        setTimeLeft(!Number.isNaN(t) ? t : 0);
      });

      socket.on("auction_paused", (data) => {
        setIsPaused(true);
        setTimeLeft(Number(data.remaining ?? 0));
      });

      socket.on("auction_resumed", (data) => {
        setIsPaused(false);
        setTimeLeft(Number(data.remaining ?? 0));
      });

      socket.on("timer_update", (data) => {
        if (!data) return;
        if (!isPaused) {
          const r = Number(
            data.remaining_seconds ?? data.time_left ?? data.remaining ?? 0
          );
          setTimeLeft(r);
        }
      });

      socket.on("auction_cleared", () => {
        setAuctionData(null);
        setNotifications([]);
        setTimeLeft(0);
      });

      socket.on("auction_ended", (data) => {
        setTimeLeft(0);

        if (data.status === "sold") {
          navigate("/sold", {
            state: {
              player: data.player,
              team: data.team,
              base_price: data.player?.base_price,
              finale_bid: data.team?.bid_amount,
              message: data.message,
            },
          });
        } else if (data.status === "unsold") {
          navigate("/unsold", {
            state: {
              player: data.player,
              base_price: data.player?.base_price,
              message: data.message,
            },
          });
        } else {
          // reload auction status
          api
            .get("/current-auction", {
              withCredentials: true,
            })
            .then((r) =>
              r.data?.status === "auction_active"
                ? setAuctionData(r.data)
                : setAuctionData(null)
            );
        }
      });

      socket.on("bid_placed", (payload) => {
        console.log("✅ Bid placed successfully:", payload);
        console.info(`✅ ${payload.team_name} placed ₹${payload.bid_amount}`);
      });

      socket.on("bid_rejected", (msg) => {
        alert(msg.error);
      });
    };

    startRealtime();

    return () => {
      mounted = false;
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = document.querySelector(".notifications");
    if (el) el.scrollTop = el.scrollHeight;
  }, [notifications]);

  useEffect(() => {
    const el = document.querySelector(".notifications");
    if (el) el.scrollTop = el.scrollHeight;
  }, [notifications]);

  const formatTime = (seconds) => {
    const s = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
      s % 60
    ).padStart(2, "0")}`;
  };

  // ---- BID FUNCTION ----
  const placeBidSocket = (bidAmount) => {
    const teamId = teamIdRef.current;
    const playerId = auctionData?.player?.id;

    if (isPaused) {
      alert("Auction is paused — bidding is disabled.");
      return;
    }
    if (!teamId) return alert("Team ID missing");
    if (!playerId) return alert("No active player");
    if (bidAmount > teamBalance) return alert("You don't have enough purse!");

    socket.emit(
      "place_bid",
      {
        team_id: teamId,
        player_id: playerId,
        bid_amount: bidAmount,
      },
      (ack) => {
        if (ack?.error) alert(ack.error);
        if (ack?.message) alert(ack.message);
      }
    );
  };

  // UI Rendering
  if (loading) return <p>Loading player...</p>;
  if (!auctionData || !auctionData.player)
    return <div className="alert alert-warning">No active auction player.</div>;

  const player = auctionData.player;
  const basePrice =
    auctionData.basePrice ?? auctionData.base_price ?? player.base_price ?? 0;

  // ⭐ FINAL & CORRECT CURRENT BID LOGIC
  const currentBid = Number(
    auctionData?.currentBid ?? auctionData?.highest_bid?.bid_amount ?? basePrice
  );

  const displayNextSteps = auctionData.nextSteps ?? nextSteps ?? [];
  const displayTeamBalance = auctionData.teamBalance ?? teamBalance ?? 0;
  const displayCanBid = auctionData.canBid ?? canBid ?? false;

  return (
    <>
      <Navbar />
      <div className="auction-bg d-flex flex-column align-items-center">
        <div className="container auction-container p-1 rounded shadow-lg">
          <div className="container player-info-container shadow p-2 rounded">
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
                    <div className="value">
                      {player.jersey ?? player.jersey_number}
                    </div>
                  </div>

                  <div className="col-md-6 info-box red">
                    <div className="label">Role</div>
                    <div className="value">{player.category}</div>
                  </div>

                  <div className="col-md-6 info-box red">
                    <div className="label">Type</div>
                    <div className="value">{player.type}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* PRICE + TIMER */}
            <div className="row text-center mt-3">
              <div className="col-md-4 d-flex flex-column align-items-center">
                <div className="p-3 mb-1 rounded bg-light shadow base-price">
                  <strong>Base Price</strong>
                  <p>₹{basePrice}</p>
                </div>

                <div className="p-3 rounded-circle bg-warning shadow current-price">
                  <strong>Current Price</strong>
                  <h4>₹{currentBid}</h4>
                </div>
              </div>

              <div className="col-md-4 d-flex justify-content-center align-items-center">
                <div className="timer bg-warning text-dark p-3 rounded">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* BIDDING BUTTONS */}
              <div className="col-md-4 d-flex flex-column align-items-center">
                <div className="quick-bids mb-1">
                  {displayNextSteps.map((b, i) => (
                    <button
                      key={i}
                      className="btn btn-danger m-1 bit-btn"
                      disabled={
                        isPaused ||
                        !displayCanBid ||
                        b > displayTeamBalance ||
                        timeLeft <= 0
                      }
                      onClick={() => placeBidSocket(b)}
                    >
                      ₹{b}
                    </button>
                  ))}
                </div>

                <div className="p-3 mb-1 rounded bg-light shadow base-price">
                  <strong>Your Purse</strong>
                  <p>₹{displayTeamBalance}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
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
                      className={`${
                        flashIndex === i ? "flash" : ""
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
        </div>
      </div>
    </>
  );
};

export default Auction;

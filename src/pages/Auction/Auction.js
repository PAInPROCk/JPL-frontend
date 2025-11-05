import Navbar from "../../components/Navbar";
import "./Auction.css";
import { useNavigate } from "react-router-dom";
import fallbackImg from "../../assets/images/PlAyer.png";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import useSyncedTimer from "../../hooks/useSyncedTimer";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const useSocket = () => {
  const socketRef = useRef();
  if (!socketRef.current) {
    socketRef.current = io(API_BASE_URL, { withCredentials: true });
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
  const audioRef = useRef(
    new Audio(require("../../assets/Sounds/mixkit-software-interface-start-2574.wav"))
  );

  const navigate = useNavigate();
  const socket = useSocket();
  useSyncedTimer(socket, setTimeLeft, isPaused);

  const teamIdRef = useRef(null);

  // Load initial auction data`
  const loadInitial = async () => {
    try {
      setLoading(true);
      const authRes = await axios.get(`${API_BASE_URL}/check-auth`, {
        withCredentials: true,
      });
      const auctionRes = await axios.get(`${API_BASE_URL}/current-auction`, {
        withCredentials: true,
      });

      if (!authRes.data.authenticated) {
        navigate("/");
        return false;
      }


      if (auctionRes.data && auctionRes.data.status === "auction_active") {
        setAuctionData(auctionRes.data);
        setNotifications(auctionRes.data.history || []);
        setNextSteps(auctionRes.data.nextSteps || []);
        setTeamBalance(auctionRes.data.teamBalance || 0);
        setCanBid(Boolean(auctionRes.data.canBid));

        const seed =
          auctionRes.data.remaining_seconds ??
          auctionRes.data.time_left ??
          auctionRes.data.timeLeft ??
          0;
        setTimeLeft(Number(seed));
      } else {
        setAuctionData(null);
      }

      return true;
    } catch (err) {
      console.error("Auth / initial load failed:", err);
      navigate("/");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Listen to socket events
  useEffect(() => {
    let mounted = true;

    try {
      socket.connect();
    } catch (e) {
      console.warn("Socket connect failed:", e);
    }

    const startRealtime = async () => {
      const ok = await loadInitial();
      if (!ok) return;

      socket.emit("join_auction", {
        team_id: teamIdRef.current,
        team_name: auctionData?.data?.user?.team_name || "Unknown Team",
        purse: auctionData?.data?.teamBalance || 0,
      });

      socket.on("auction_update", (data) => {
        if (!mounted) return;
        setTimeLeft(data.time_left);
        setIsPaused(data.paused);
        // server may send different keys; handle both historical and current-style payloads
        setAuctionData((prev) => {
          // prefer richer server payload
          return data;
        });
        setAuctionData(data);

        const serverTime = Number(
          data.time_left ??
            data.remaining_seconds ??
            data.timeLeft ??
            0
        );
        if (!Number.isNaN(serverTime) && serverTime >= 0) {
          setTimeLeft(serverTime);
        }

        if (data.history) setNotifications(data.history);
        if (data.nextSteps) setNextSteps(data.nextSteps);
        if (typeof data.teamBalance !== "undefined")
          setTeamBalance(data.teamBalance);
        if (typeof data.canBid !== "undefined") setCanBid(data.canBid);

        if (data.highest_bid) {
          setNotifications((prev) => {
            const next = [...prev, data.highest_bid];
            setFlashIndex(next.length - 1);
            setTimeout(() => setFlashIndex(null), 1500);
            try {
              audioRef.current.play();
            } catch {}
            return next;
          });
        }
      });

      socket.on("auction_started", (data) => {
        if (!mounted) return;
        setAuctionData(data);
        const t = Number(data.time_left ?? data.remaining_seconds ?? 0);
        if (!Number.isNaN(t) && t > 0) {
          setTimeLeft(t);
        } else {
          // fallback: wait for the first timer_update
          console.warn("⏱️ No initial time from auction_started, waiting for timer_update...");
        }
        setNotifications([]);
      });

      socket.on("auction_paused", (data) => {
        setIsPaused(true);
        setTimeLeft(data.remaining);
      });

      socket.on("auction_resumed", (data) => {
        setIsPaused(false);
        setTimeLeft(data.remaining);
      });

      socket.on("timer_update", (data) => {
        if (!data) return;
        const remaining = Number(data.remaining_seconds ?? data.time_left ?? data.remaining ?? 0);
        if (!isPaused) setTimeLeft(remaining);
      });


      socket.on("auction_ended", (data) => {
        if (!mounted) return;
        setTimeLeft(0);

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
        } else {
          axios
            .get(`${API_BASE_URL}/current-auction`, { withCredentials: true })
            .then((r) => {
              if (r.data && r.data.status === "auction_active")
                setAuctionData(r.data);
              else setAuctionData(null);
            })
            .catch(() => console.error("Auction fetch failed"));
        }
      });

      socket.on("auction_cleared", () => {
        if (!mounted) return;
        setAuctionData(null);
        setNotifications([]);
        setTimeLeft(0);
      });

      socket.on("bid_placed", (payload) => {
        console.log("bid_placed ack:", payload);
      });

      socket.on("error", (err) => {
        console.warn("socket error:", err);
      });
    };

    startRealtime();

    return () => {
      mounted = false;
      socket.removeAllListeners();
      try {
        socket.disconnect();
      } catch {}
    };
  }, []);

  // Format time for display
  const formatTime = (seconds) => {
    const s = Math.max(0, Math.floor(Number(seconds) || 0));
    const minutes = String(Math.floor(s / 60)).padStart(2, "0");
    const secs = String(s % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  // Place bid via socket
  const placeBidSocket = (bidAmount) => {
    const teamId = teamIdRef.current;
    if (!teamId) {
      alert("Team ID not found in session. Can't place bid.");
      return;
    }
    if (bidAmount > teamBalance) {
      alert("You don't have enough purse!");
      return;
    }

    socket.emit("place_bid", { team_id: teamId, bid_amount: bidAmount });
  };

  if (loading) return <p>Loading player...</p>;
  if (!auctionData || !auctionData.player)
    return <div className="alert alert-warning">No active auction player.</div>;

  const player = auctionData.player || {};
  const basePrice =
    auctionData.basePrice ?? auctionData.base_price ?? player.base_price ?? 0;
  const currentBid =
    auctionData.currentBid ?? auctionData.highest_bid?.bid_amount ?? 0;
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
                  src={player?.image_path || fallbackImg}
                  alt={player?.name}
                  className="player-image img-fluid"
                  onError={(e) => (e.target.src = fallbackImg)}
                />
              </div>
              <div className="col-md-9">
                <div className="row g-3">
                  <div className="col-md-6 info-box green">
                    <div className="label">Player Name</div>
                    <div className="value">{player?.name}</div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <div className="label">Jersey No</div>
                    <div className="value">
                      {player?.jersey ?? player?.jersey_number}
                    </div>
                  </div>
                  <div className="col-md-6 info-box red">
                    <div className="label">Role</div>
                    <div className="value">{player?.category}</div>
                  </div>
                  <div className="col-md-6 info-box red">
                    <div className="label">Style</div>
                    <div className="value">{player?.type}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Timer */}
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

              {/* Timer */}
              <div className="col-md-4 d-flex justify-content-center align-items-center">
                <div className="timer bg-warning text-dark p-3 rounded">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Quick Bids */}
              <div className="col-md-4 d-flex flex-column align-items-center">
                <div className="quick-bids mb-1">
                  {displayNextSteps.map((b, i) => (
                    <button
                      key={i}
                      className="btn btn-danger m-1 bit-btn"
                      disabled={
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
          <div className="notifications mt-2 p-3 bg-dark text-white rounded">
            <h5>Notifications</h5>
            {notifications.length === 0 ? (
              <p>No Bids yet</p>
            ) : (
              notifications.map((note, i) => (
                <p key={i} className={flashIndex === i ? "flash" : ""}>
                  {note.team_name
                    ? `${note.team_name} bid ₹${note.bid_amount}`
                    : note.team
                    ? `${note.team} bid ₹${note.amount}`
                    : JSON.stringify(note)}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Auction;

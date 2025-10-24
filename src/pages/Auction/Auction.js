// src/pages/Auction/Auction.jsx
import Navbar from "../../components/Navbar";
import "./Auction.css";
import { useNavigate } from "react-router-dom";
import fallbackImg from "../../assets/images/PlAyer.png";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "../../socket";

const Auction = () => {
  const [auctionData, setAuctionData] = useState(null); // server payload for auction
  const [timeLeft, setTimeLeft] = useState(0); // seconds (local countdown)
  const [notifications, setNotifications] = useState([]); // list of bid notifications
  const [flashIndex, setFlashIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canBid, setCanBid] = useState(false);
  const [teamBalance, setTeamBalance] = useState(0);
  const [nextSteps, setNextSteps] = useState([]);
  const audioRef = useRef(
    new Audio(
      require("../../assets/Sounds/mixkit-software-interface-start-2574.wav")
    )
  );

  const navigate = useNavigate();
  const API_BASE_URL = process.env.APP_BASE_URL || "http://localhost:5000";

  // store team id from check-auth
  const teamIdRef = useRef(null);
  // guard to avoid repeated initial load
  const initialLoadedRef = useRef(false);

  // load initial auction data and session (so we know teamId for emitting bids)
  const loadInitial = async () => {
    try {
      setLoading(true);
      // 1) get session info
      const authRes = await axios.get(`${API_BASE_URL}/check-auth`, {
        withCredentials: true,
      });
      if (!authRes.data.authenticated) {
        navigate("/");
        return false;
      }
      // try to extract team id from session user object (best-effort)
      // common places: user.team_id, user.teamId, user.id (if team accounts use user.id)
      const userObj = authRes.data.user || {};
      teamIdRef.current =
        userObj.team_id || userObj.teamId || userObj.team || userObj.id || null;

      // 2) load current auction once via REST to seed UI quickly (socket will update afterwards)
      const res = await axios.get(`${API_BASE_URL}/current-auction`, {
        withCredentials: true,
      });
      if (res.data && res.data.status === "auction_active") {
        setAuctionData(res.data);
        setNotifications(res.data.history || []);
        setNextSteps(res.data.nextSteps || []);
        setTeamBalance(res.data.teamBalance || 0);
        setCanBid(Boolean(res.data.canBid));
        // server may return remaining_seconds or time_left
        const seed =
          res.data.remaining_seconds ??
          res.data.time_left ??
          res.data.timeLeft ??
          0;
        setTimeLeft(Number(seed));
      } else {
        setAuctionData(null);
      }

      return true;
    } catch (err) {
      console.error("Auth / initial load failed:", err);
      // redirect to homepage on auth fail
      navigate("/");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Listen to socket events and keep UI updated in real-time
  useEffect(() => {
    let mounted = true;

    const startRealtime = async () => {
      const ok = await loadInitial();
      if (!ok) return;

      // connect socket (socket.js should be set with autoConnect:false ideally)
      try {
        socket.connect();
      } catch (e) {
        console.warn("Socket connect failed:", e);
      }

      socket.emit("join_auction", {
        team_id: teamIdRef.current,
        team_name: auctionData?.team_name || "Unknown Team",
        purse: teamBalance,
      });

      // auction update: main payload from server (player, highest_bid, expires_at, time_left, history, etc.)
      socket.on("auction_update", (data) => {
        if (!mounted) return;
        // server may send different keys; handle both historical and current-style payloads
        setAuctionData((prev) => {
          // prefer richer server payload
          return data;
        });

        // use server-provided time_left or remaining_seconds or timeLeft
        const serverTime = Number(
          data.time_left ??
            data.remaining_seconds ??
            data.timeLeft ??
            data.remaining_seconds ??
            0
        );
        if (!Number.isNaN(serverTime) && serverTime >= 0) {
          setTimeLeft(serverTime);
        }

        // update UI bits
        if (data.history) setNotifications(data.history);
        if (data.nextSteps) setNextSteps(data.nextSteps);
        if (typeof data.teamBalance !== "undefined")
          setTeamBalance(data.teamBalance);
        if (typeof data.canBid !== "undefined") setCanBid(data.canBid);

        // play sound if a new bid came (best-effort: compare top bid)
        if (data.highest_bid) {
          // push a notification entry (server may include team_name + bid_amount)
          setNotifications((prev) => {
            const lastLen = prev.length;
            const next = [...prev, data.highest_bid];
            // flash the latest
            setFlashIndex(next.length - 1);
            setTimeout(() => setFlashIndex(null), 1500);
            try {
              audioRef.current.play();
            } catch (e) {}
            return next;
          });
        }
      });

      socket.on("auction_started", (data) => {
        if (!mounted) return;
        // server may include player + time_left
        setAuctionData(data);
        const t = Number(data.time_left ?? data.remaining_seconds ?? 0);
        if (!Number.isNaN(t)) setTimeLeft(t);
        setNotifications([]);
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
          // fallback: refresh current auction if status unknown
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
        // optional: payload contains team_id and bid_amount; server also emits auction_update
        // we rely on auction_update to refresh state
        console.log("bid_placed ack:", payload);
      });

      socket.on("error", (err) => {
        console.warn("socket error:", err);
      });
    };

    startRealtime();

    return () => {
      mounted = false;
      // remove handlers and disconnect
      socket.off("auction_update");
      socket.off("auction_started");
      socket.off("auction_ended");
      socket.off("auction_cleared");
      socket.off("bid_placed");
      socket.off("error");
      try {
        socket.disconnect();
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // local decrementing countdown synced from server timeLeft
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;
    const t = setInterval(
      () => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );
    return () => clearInterval(t);
  }, [timeLeft]);

  // helper format mm:ss
  const formatTime = (seconds) => {
    const s = Number(seconds) || 0;
    const minutes = String(Math.floor(s / 60)).padStart(2, "0");
    const secs = String(s % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  // place bid via socket; backend expects { team_id, bid_amount } for place_bid handler
  const placeBidSocket = (bidAmount) => {
    const teamId = teamIdRef.current;
    if (!teamId) {
      alert("Team ID not found in session. Can't place bid.");
      console.warn(
        "Missing team id in session: check /check-auth response structure."
      );
      return;
    }
    if (bidAmount > teamBalance) {
      alert("You don't have enough purse!");
      return;
    }

    // send socket event
    socket.emit("place_bid", { team_id: teamId, bid_amount: bidAmount });
    // server will broadcast auction_update; we rely on that to refresh UI
  };

  if (loading) return <p>Loading player...</p>;
  if (!auctionData || !auctionData.player)
    return <div className="alert alert-warning">No active auction player.</div>;

  // destructure from server payload (supports multiple key names)
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

              {/* Quick Bids + Custom Input */}
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
                  {/* note may be object with team_name + bid_amount or custom shape */}
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

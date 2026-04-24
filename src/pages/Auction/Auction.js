import Navbar from "../../components/Navbar";
import "./Auction.css";
import fallbackImg from "../../assets/images/PlAyer.png";
import { useEffect, useState, useRef } from "react";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../Utils/constants";
import { useAuth } from "../../context/AuthContext";

const Auction = () => {

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [auction, setAuction] = useState({
    player: null,
    history: [],
    currentBid: 0,
    timer: 0,
    paused: false,
    teamBalance: 0
  });
  const [flashIndex, setFlashIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(new Audio(require("../../assets/Sounds/mixkit-software-interface-start-2574.wav")));

  const MIN_INCREMENT = 500;

  // ---------------- SOCKET LISTENERS ----------------

  useEffect(() => {

    if (authLoading || !user) return;

    socket.emit("join_auction",{
      team_id: user.team_id
    });

    const handleAuctionStatus = (data) => {

      if (data.status !== "auction_active") return;

      const base = Number(data.player.base_price);
      const current = Number(data.highest_bid?.bid_amount || base);

      setAuction(prev => ({
        ...prev,
        player: data.player,
        currentBid: current,
        history: [],
        paused: false,
        teamBalance: Number(data.team_purse ?? user?.team_purse ?? 0)
      }));

      setLoading(false);
    };

    const handleAuctionStarted = (data) => {

      setAuction(prev => ({
        ...prev,
        player: data.player,
        history: [],
        currentBid: data.current_bid || data.player?.base_price,
        timer: data.duration,
        paused: false
      }));
    };

    const handleAuctionUpdate = (data) => {

      setAuction(prev => ({
        ...prev,
        currentBid: data.current_bid ?? prev.currentBid,
        history: data.history ?? prev.history
      }));
    };

    const handleTimer = (data) => {

      setAuction(prev => ({
        ...prev,
        timer: data.remaining_seconds
      }));
    };

    const handlePaused = (data) => {

      setAuction(prev => ({
        ...prev,
        paused: true,
        timer: data.remaining_seconds
      }));
    };

    const handleResumed = (data) => {

      setAuction(prev => ({
        ...prev,
        paused: false,
        timer: data.remaining_seconds
      }));
    };

    const handleEnded = (data) => {

      if (data.status === "sold") {
        navigate("/sold", { state: data });
      } else {
        navigate("/unsold", { state: data });
      }
    };

    const handlePurseUpdate = (data) =>{
      setAuction(prev => ({
        ...prev,
        teamBalance: data.purse
      }));
    }

    socket.on("auction_status", handleAuctionStatus);
    socket.on("auction_started", handleAuctionStarted);
    socket.on("auction_update", handleAuctionUpdate);
    socket.on("timer_update", handleTimer);
    socket.on("auction_paused", handlePaused);
    socket.on("auction_resumed", handleResumed);
    socket.on("auction_ended", handleEnded);
    socket.on("purse_update", handlePurseUpdate);

    socket.on("bid_rejected", (msg) => {
      alert(msg?.error || "Bid rejected");
    });

    return () => {

      socket.off("auction_status", handleAuctionStatus);
      socket.off("auction_started", handleAuctionStarted);
      socket.off("auction_update", handleAuctionUpdate);
      socket.off("timer_update", handleTimer);
      socket.off("auction_paused", handlePaused);
      socket.off("auction_resumed", handleResumed);
      socket.off("auction_ended", handleEnded);
      socket.off("bid_rejected");
      socket.off("purse_update", handlePurseUpdate);
    };

  }, [user, authLoading, navigate]);

  useEffect(() => {
    const el = document.querySelector(".notifications-list");
    if (el) el.scrollTop = el.scrollHeight;
  }, [auction.history]);
  const basePrice = auction.player?.base_price ?? 0;
  const currentBid = auction.currentBid ?? basePrice;

  useEffect(() => {

    if (!auction.history.length) return;

    const lastIndex = auction.history.length - 1;

    setFlashIndex(lastIndex);

    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } catch { }

    const timeout = setTimeout(() => {
      setFlashIndex(null);
    }, 1500);

    return () => clearTimeout(timeout);

  }, [auction.history]);

  // ---------------- BID FUNCTION ----------------

  const placeBid = (amount) => {

    if (auction.paused) return alert("Auction paused");

    if (amount > auction.teamBalance) {
      return alert("Insufficient purse");
    }

    socket.emit("place_bid", {
      team_id: user.team_id,
      player_id: auction.player?.id,
      bid_amount: amount
    });
  };

  // ---------------- TIMER FORMAT ----------------

  const formatTime = (seconds) => {

    const s = Math.max(0, Math.floor(Number(seconds) || 0));
    const mins = String(Math.floor(s / 60)).padStart(2, "0");
    const secs = String(s % 60).padStart(2, "0");

    return `${mins}:${secs}`;
  };

  if (loading) return <p>Loading auction...</p>;

  if (!auction.player) {

    return (
      <div className="text-center mt-5">
        Waiting for next player...
      </div>
    );
  }

  const nextSteps = auction.player
  ? [
      currentBid + MIN_INCREMENT
    ]
  : [];
  console.log("Team purse:", user.team_purse)
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
                    auction.player.image_path
                      ? `${API_BASE_URL}/${auction.player.image_path}`
                      : fallbackImg
                  }
                  alt={auction.player.name}
                  className="player-image img-fluid"
                  onError={(e) => (e.target.src = fallbackImg)}
                />
              </div>

              <div className="col-md-9">
                <div className="row g-3">
                  <div className="col-md-6 info-box green">
                    <div className="label">Player Name</div>
                    <div className="value">{auction.player.name}</div>
                  </div>

                  {/*<div className="col-md-3 info-box green">
                    <div className="label">Jersey No</div>
                    <div className="value">
                      {auction.player.jersey ?? auction.player.jersey_number}
                    </div>
                  </div>*/}

                  <div className="col-md-6 info-box red">
                    <div className="label">Role</div>
                    <div className="value">{auction.player.category}</div>
                  </div>

                  <div className="col-md-6 info-box red">
                    <div className="label">Type</div>
                    <div className="value">{auction.player.type}</div>
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
                  {formatTime(auction.timer)}
                </div>
              </div>

              {/* BIDDING BUTTONS */}
              <div className="col-md-4 d-flex flex-column align-items-center">
                <div className="quick-bids mb-1">
                  {nextSteps.map((b, i) => (
                    <button
                      key={i}
                      className="btn btn-danger m-1 bit-btn"
                      disabled={
                        auction.paused ||
                        b > auction.teamBalance ||
                        auction.timer <= 0
                      }
                      onClick={() => placeBid(b)}
                    >
                      ₹{b}
                    </button>
                  ))}
                </div>

                <div className="p-3 mb-1 rounded bg-light shadow base-price">
                  <p>₹{auction.teamBalance}</p>
                </div>
                <div className="p-3 mb-2 rounded bg-light shadow d-flex align-items-center">
                  <img src={user?.team_logo ? `${API_BASE_URL}/${user.team_logo}` : fallbackImg}
                    alt="team logo"
                    width="50"
                    height="50"
                    className="me-2"/>
                    <strong>{user.team_name} Purse</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="notifications-container">
            <h5 className="notifications-title">Notifications</h5>

            <div className="notifications-list">
              {auction.history.length ? (
                auction.history.map((note, i) => {
                  const rankClass =
                    i === auction.history.length - 1
                      ? "gold"
                      : i === auction.history.length - 2
                        ? "silver"
                        : i === auction.history.length - 3
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
        </div>
      </div>
    </>
  );
};

export default Auction;

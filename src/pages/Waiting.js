import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Waiting.css";
import Spinner from "../components/Spinner";
import { socket } from "../socket";
import { api } from "../Config";
import { useAuth } from "../context/AuthContext";



const Waiting = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const { isAuthenticated, user, loading } = useAuth();



  useEffect(() => {
    if (loading || !user) return;

    let mounted = true;

    const checkAuction = async () => {
      try {
        const res = await api.get("/auction-status", {
          withCredentials: true,
        });

        if (mounted && res.data.active) {
          navigate("/auction");
        }
      } catch (err) {
        console.error("Error checking auction:", err);
      } finally {
        if (mounted) setChecking(false);
      }
    };

    checkAuction();

    // wait for socket connection
    socket.on("connect", () => {

      socket.emit("join_auction", {
        team_id: user.team_id
      });

    });

    socket.on("auction_started", () => {
      navigate("/auction");
    });

    socket.on("auction_status", (data) => {
      if (data.status === "auction_active") {
        navigate("/auction");
      }
    });

    const interval = setInterval(checkAuction, 10000);

    return () => {
      mounted = false;
      socket.off("connect");
      socket.off("auction_started");
      socket.off("auction_status");
      clearInterval(interval);
    };

  }, [loading, user, navigate]);
  if (checking)
    return (
      <div className="waiting-bg d-flex flex-column justify-content-center align-items-center text-center vh-100 text-white">
        <p className="fs-5 mb-3">Checking auction status...</p>
        <Spinner />
      </div>
    );

  return (
    <div className="waiting-bg d-flex flex-column justify-content-center align-items-center text-center vh-100">
      <div className="mb-4">
        <img
          src="/assets/images/cricket.png"
          alt="JPL Logo"
          width="80"
          height="80"
        />
        <h2 className="mt-2 text-white">JPL Auction</h2>
      </div>

      <div className="p-4 bg-dark bg-opacity-75 rounded shadow text-white">
        <p className="fs-5 mb-3">Waiting for Admin to Start Auction...</p>
        <Spinner />
      </div>
    </div>
  );
};

export default Waiting;

 import Navbar from "../../components/Navbar";
import "./Auction.css";
import { useNavigate } from "react-router-dom";
import fallbackImg from "../../assets/images/PlAyer.png";
import { fetchPlayers } from "../Players/PlayerData";
import { useEffect, useState, useRef, use } from "react";
import axios from "axios";

const Auction = () => {
  const [auctionData, setAuctionData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [flashIndex, setFlashIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const audioRef = useRef(new Audio(require("../../assets/Sounds/mixkit-software-interface-start-2574.wav")));

    const loadAuction = async () => {
      try{
        setLoading(true);
        const {data} = await axios.get("http://localhost:5000/api/auction/current",{withCredentials: true});
        setAuctionData(data);
        setNotifications(data.history || []);

        if(data.auctionEndsAt){
          const endTime = new Date(data.auctionEndsAt).getTime();
          setTimeLeft(Math.max(0, endTime - Date.now()));
        }

        if(data.history?.length > notifications.length){
          audioRef.current.play();
          setFlashIndex(data.history.length - 1);
          setTimeout(()=> setFlashIndex(null),1500);
        }
      }catch(err){
          console.error("Failed to load auction:", err);
    } finally{
          setLoading(false);
    }
  };

  
    useEffect(() => {
      const checkAuthandLoad = async () =>{
        try{
          const authRes = await axios.get("http://localhost:5000/check-auth",{
            withCredentials: true,
          });

          if(!authRes.data.authenticated){
            navigate("/");
            return;
          }

          if(!["user","admin"].includes(authRes.data.role)){
            navigate("/"); 
            return;
          }

          const res = await axios.get("http://localhost:5000/current-auction",{
            withCredentials: true,
          });
        } catch (err){
          navigate("/")
        } finally{
          setLoading(false);
        }
      };
      checkAuthandLoad();

      loadAuction();
      const interval = setInterval(loadAuction,5000)
      return () => clearInterval(interval);
    }, [navigate]);

    useEffect(() => {
      if(!auctionData?.auctionEndsAt) return;

      const endTime = new Date(auctionData.auctionEndsAt).getTime();
      const interval = setInterval(() => {
        const diff = Math.max(0, endTime - Date.now());
        setTimeLeft(diff);
        if(diff <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return ()=> clearInterval(interval);
    }, [auctionData]);

    const formatTime = (ms) =>{
      const totalSeconds = Math.floor(ms/1000);
      const minutes = String(Math.floor(totalSeconds/60)).padStart(2,"0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      return `${minutes} : ${seconds}`;
    }
  
    if(loading) return <p>Loading player...</p>;
    if(!auctionData) return <div className="alert alert-warning">No active auction player.</div>;

    const {player, basePrice, currentBid, nextSteps = [],teamBalance, canBid} = auctionData;

    const handleBid = async (bid) => {
      if(bid > teamBalance){
        alert("You don't have enough purce!");
        return;
      }
      try{
        await axios.post("http://localhost:5000/api/auction/bid",{amount: bid},{withCredentials: true});
        loadAuction();
      }catch(err){
        alert(err.response?.data?.error || "Bid Failed");
      }
    }
  return (
    <>
      <Navbar />
      <div className="auction-bg d-flex flex-column align-items-center">
        <div className="container auction-container p-1 rounded shadow-lg">
          <div className="container player-info-container shadow p-2 rounded">
            <div className="row g-4">
              <div className="col-md-3 text-center">
                <img
                  src={player?.image || fallbackImg}
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
                    <div className="value">{player?.jersey}</div>
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
            <div className="row text-center mt-3">
              {/* Price Section */}
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
                  {timeLeft > 0 ? formatTime(timeLeft) : "Auction Ended"}
                </div>
              </div>

              {/* Quick Bids + Custom Input */}
              <div className="col-md-4 d-flex flex-column align-items-center">
                <div className="quick-bids mb-1">
                  {nextSteps.map((bid, i)=> (
                    <button
                      key={i}
                      className="btn btn-danger m-1 bit-btn"
                      disabled={!canBid || bid > teamBalance || timeLeft <= 0}
                      onClick={() => handleBid(bid)}
                    >
                      ₹{bid}
                    </button>
                  ))}
                </div>
                <div className="p-3 mb-1 rounded bg-light shadow base-price">
                  <strong>Your Purce</strong>
                  <p>₹{teamBalance}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="notifications mt-2 p-3 bg-dark text-white rounded">
            <h5>Notifications</h5>
            {notifications.length === 0 ?(
              <p>No Bids yet </p>
            ) : (notifications.map((note, i) => (
              <p 
                key={i}
                className={flashIndex === i ? "flash" : ""}
              >
                {note.team} bid ₹{note.amount}
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

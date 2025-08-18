import Navbar from "../../components/Navbar";
import "./Auction.css";
import { useNavigate } from "react-router-dom";
import fallbackImg from "../../assets/images/PlAyer.png";
import { fetchPlayers } from "../Players/PlayerData";
import { useEffect, useState } from "react";
import axios from "axios";

const Auction = () => {
  const [auctionData, setAuctionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loadAuction = async () => {
      setLoading(true);
      const {data} = await axios.get("http://localhost:5000/api/auction/current",{withCredentials: true});
      setAuctionData(data);
      setLoading(false);
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
  
    if(loading) return <p>Loading player...</p>;
    if(!player) return <p>No Player found</p>;
    if(!auctionData) return <div className="alert alert-warning">No active auction player.</div>;

    const {player, basePrice, currentBid, nextSteps = [],teamBalance, canBid} = auctionData;

    const handleBid = async (bid) => {
      if(bid > teamBalance){
        alert("You don't have enough purce!");
        return;
      }
      try{
        await axios.post("http://localhost:5000/api/auction/bid",{amount: bid},{withCredentials: true})
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
                  00 : 00 : 00
                </div>
              </div>

              {/* Quick Bids + Custom Input */}
              <div className="col-md-4 d-flex flex-column align-items-center">
                <div className="quick-bids mb-1">
                  {nextSteps.map((bid, i)=> (
                    <button
                      key={i}
                      className="btn btn-danger m-1 bit-btn"
                      disabled={!canBid || bid > teamBalance}
                      onClick={() => axios.post("http://localhost:5000/api/auction/bid", {amout: bid}, {withCredentials: true})}
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
            <p>Team A bid ₹1000</p>
            <p>Team B bid ₹2000</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auction;

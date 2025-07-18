import Navbar from "../../components/Navbar";
import './Auction.css';


const Auction = () => {
  return (
    <>
      <Navbar />
      <div className="auction-bg d-flex flex-column align-items-center">
        <div className="container auction-container p-4 rounded shadow-lg">
          <div className="row text-center">
            {/* Player Section */}
            <div className="col-md-4 d-flex flex-column align-items-center mb-3">
              <img
                src="/assets/images/PLAyer.png"
                alt="Player"
                className="img-fluid rounded-circle player-img"
              />
              <div className="d-flex flex-wrap justify-content-center mt-3">
                <div className="badge bg-success mx-2 px-3 py-2">Player Name</div>
                <div className="badge bg-success mx-2 px-3 py-2">Age: 19</div>
                <div className="badge bg-danger mx-2 px-3 py-2">Category: Baller</div>
                <div className="badge bg-danger mx-2 px-3 py-2">Type: Spinner</div>
              </div>
            </div>

            {/* Auction Details Section */}
            <div className="col-md-4 mb-3">
              <div className="p-3 mb-3 rounded bg-light shadow">
                <strong>Base Price</strong>
                <p>₹5000</p>
              </div>
              <div className="p-3 mb-3 rounded-circle bg-warning shadow current-price">
                <strong>Current Price</strong>
                <h4>₹10000</h4>
              </div>
              <div className="timer bg-warning text-dark p-3 rounded mt-3">
                00 : 00 : 00
              </div>
            </div>

            {/* Bidding Buttons */}
            <div className="col-md-4 mb-3 d-flex flex-column align-items-center">
              <div className="quick-bids mb-3">
                {["+100", "+500", "+1000", "+2000", "+5000", "+10000"].map((bid, i) => (
                  <button key={i} className="btn btn-danger m-2 bid-btn">
                    {bid}
                  </button>
                ))}
              </div>
              <div className="input-group mt-2 w-75">
                <span className="input-group-text">₹</span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Custom Price"
                />
                <button className="btn btn-success">▶</button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="notifications mt-4 p-3 bg-dark text-white rounded">
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
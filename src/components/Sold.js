import "./Sold.css";

const Sold = () => {
  return (
    <div className="bg">
    <div className="sold-page container text-white py-4">
      <div className="row align-items-center">
        {/* Player Image */}
        <div className="col-md-4 text-center">
          <div className="sold-img-wrapper">
            <img
              src="../../assets/images/PLAyer.png"
              alt="Player"
              className="img-fluid rounded-circle border border-4"
            />
            <div className="sold-stamp">SOLD!</div>
          </div>
        </div>

        {/* Player Details */}
        <div className="col-md-8 text-center text-md-start">
          <h1 className="player-name">SAM CURRAN</h1>

          <div className="d-flex justify-content-center justify-content-md-start align-items-center gap-3 mb-3">
            <h5 className="m-0 team-name">TEAM</h5>
            <img
              src="../../assets/images/football-team_16848377.png"
              alt="Team Logo"
              className="team-logo"
            />
            <h4 className="text-info fw-bold m-0">KINGS XI PUNJAB</h4>
          </div>

          <div className="price-info d-flex flex-column flex-md-row gap-3">
            <div className="price-box bg-dark text-warning p-3 rounded">
              <strong>Base Price:</strong> ₹2 Crore
            </div>
            <div className="price-box bg-dark text-success p-3 rounded">
              <strong>Sold For:</strong> ₹7.2 Crore
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Sold;

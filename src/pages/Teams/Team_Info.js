import bgImage from "../../assets/images/vecteezy_cricket-stadium_427062.jpg"; // ✅ Correct path
import "./Team_Info.css";
import Navbar from "../../components/Navbar";

const Team_Info = () => {
  return (
    <>
      <Navbar />
      <div className="ti_bg" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="team-info-card container d-flex justify-content-center align-items-center py-5">
          <div className="row shadow-lg p-4 rounded team-info-wrapper">
            <div className="col-md-4 d-flex justify-content-center align-items-center">
              <img
                src="/assets/images/football-team_16848377.png"
                className="team-logo"
                alt="Team Logo"
              />
            </div>

            <div className="col-md-8">
              <div className="info-row mb-4 d-flex align-items-center justify-content-between flex-wrap">
                <div className="info-label">Team Name</div>
                <div className="info-value">JPL Titans</div>
              </div>
              <div className="info-row mb-4 d-flex align-items-center justify-content-between flex-wrap">
                <div className="info-label">Team Rank</div>
                <div className="info-value">1st</div>
              </div>
              <div className="info-row mb-4 d-flex align-items-center justify-content-between flex-wrap">
                <div className="info-label">Total Budget</div>
                <div className="info-value">₹20,000</div>
              </div>
              <div className="info-row mb-4 d-flex align-items-center justify-content-between flex-wrap">
                <div className="info-label">Players Bought</div>
                <div className="info-value">5</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Team_Info;

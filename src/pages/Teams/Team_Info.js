import Navbar from "../../components/Navbar";
import './Team_Info.css';
import TeamImg from "../../assets/images/football-team_16848377.png";

const Team_info = () => {
  return (
    <>
      <Navbar />
      <div className="team-info-bg">
        <div className="container team-info-container shadow p-4 rounded">
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <img src={TeamImg} alt="Player" className="team-image img-fluid" />
            </div>

            <div className="col-md-9">
              <div className="row g-3">
                <div className="col-md-6 info-box orange">
                  <div className="label">Team Name</div>
                  <div className="value">JPL 1</div>
                </div>
                <div className="col-md-3 info-box orange">
                  <div className="label">Team Rank</div>
                  <div className="value">1</div>
                </div>
                <div className="col-md-3 info-box green">
                  <div className="label">Total Budget</div>
                  <div className="value">—</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Current Season Budget</div>
                  <div className="value">--</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Players Bought</div>
                  <div className="value">--</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Team_info;

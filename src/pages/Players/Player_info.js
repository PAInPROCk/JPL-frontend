import Navbar from "../../components/Navbar";
import './Player_info.css';
import React from "react";
import playerImg from "../../assets/images/PlAyer.png";
import teamIcon from "../../assets/images/football-team_16848377.png";

const Player_info = () => {
  return (
    <>
      <Navbar />
      <div className="player-info-bg">
        <div className="container player-info-container shadow p-4 rounded">
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <img src={playerImg} alt="Player" className="player-image img-fluid" />
            </div>

            <div className="col-md-9">
              <div className="row g-3">
                <div className="col-md-6 info-box green">
                  <div className="label">Player Name</div>
                  <div className="value">Prathamesh Bhadwalkar</div>
                </div>
                <div className="col-md-3 info-box green">
                  <div className="label">Age</div>
                  <div className="value">19</div>
                </div>
                <div className="col-md-3 info-box green">
                  <div className="label">Nick Name</div>
                  <div className="value">—</div>
                </div>

                <div className="col-md-6 info-box red">
                  <div className="label">Player Category</div>
                  <div className="value">Baller</div>
                </div>
                <div className="col-md-6 info-box red">
                  <div className="label">Type</div>
                  <div className="value">Right Hand Spinner</div>
                </div>

                <div className="col-md-3 stat-box orange">
                  <div className="label">Total Runs</div>
                  <div className="value">100</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Highest Runs</div>
                  <div className="value">45</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Wickets Taken</div>
                  <div className="value">10</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Being Out</div>
                  <div className="value">5</div>
                </div>

                <div className="col-12 team-box">
                  <div className="label bg-primary text-white p-2 rounded">Played for Teams</div>
                  <div className="d-flex gap-3 mt-2 flex-wrap">
                    <img src={teamIcon} className="team-logo1" alt="Team" />
                    <img src={teamIcon} className="team-logo1" alt="Team" />
                    <img src={teamIcon} className="team-logo1" alt="Team" />
                    <img src={teamIcon} className="team-logo1" alt="Team" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Player_info;

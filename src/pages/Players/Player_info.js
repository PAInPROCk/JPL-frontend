import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./Player_info.css";
import {fetchPlayers} from "./PlayerData";
import fallbackImg from "../../assets/images/PlAyer.png";
import teamIcon from "../../assets/images/football-team_16848377.png";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import titansLogo from "../../assets/teams/Team2.png";
import warriorsLogo from "../../assets/teams/Team1.png";
import kingsLogo from "../../assets/teams/Team3.png";
import knightsLogo from "../../assets/teams/Team4.png";

const teamLogos = {
  "JPL Titan": titansLogo,
  "JPL Warriors": warriorsLogo,
  "JPL Kings": kingsLogo,
  "JPL Knights": knightsLogo,
};

const Player_info = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true); 
  const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const loadPlayer = async ()=>{
      const allPlayers = await fetchPlayers();
      const foundPlayer = allPlayers.find((p) => p.player_id === parseInt(id));
      setPlayer(foundPlayer);
      setLoading(false);
    };
    loadPlayer();
  }, [id]);

  if(loading){
    return (
      <>
        <Navbar/>
        <div className="text-center mt-5 text-muted">
          <h2>Loading Player....</h2>
          <Spinner/>
        </div>
      </>
    );
  }
  if (!player) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-5 text-danger">
          <h2>Player not found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="player-info-bg">
        <div className="container player-info-container shadow p-4 rounded">
          <div className="row g-4">
            {/* Player Image */}
            <div className="col-md-3 text-center">
              <img
                src={player.image_path ? `${API_BASE_URL}/${player.image_path}` : fallbackImg}
                alt={player.name}
                className="player-image img-fluid"
                onError={(e) => (e.target.src = fallbackImg)}
              />
            </div>

            {/* Player Details */}
            <div className="col-md-9">
              <div className="row g-3">
                <div className="col-md-6 info-box green">
                  <div className="label">Player Name</div>
                  <div className="value">{player.name}</div>
                </div>
                <div className="col-md-3 info-box green">
                  <div className="label">Jersey No</div>
                  <div className="value">{player.jersey}</div>
                </div>
                <div className="col-md-3 info-box green">
                  <div className="label">Nick Name</div>
                  <div className="value">{player.nickname || "--"}</div>
                </div>

                <div className="col-md-6 info-box red">
                  <div className="label">Player Category</div>
                  <div className="value">{player.category}</div>
                </div>
                <div className="col-md-6 info-box red">
                  <div className="label">Style</div>
                  <div className="value">{player.type}</div>
                </div>

                {/* Stats */}
                <div className="col-md-3 stat-box orange">
                  <div className="label">Total Runs</div>
                  <div className="value">{player.total_runs}</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Highest Runs</div>
                  <div className="value">{player.highest_runs}</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Wickets Taken</div>
                  <div className="value">{player.wickets_taken}</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Being Out</div>
                  <div className="value">{player.times_out}</div>
                </div>

                {/* Teams */}
                <div className="col-12 team-box">
                  <div className="label bg-primary text-white p-2 rounded">
                    Played for Teams
                  </div>
                  <div className="d-flex gap-3 mt-2 flex-wrap">
                    
                     {player.teams_played
                      ? player.teams_played.split(",").map((team, i) => (
                          <div key={i} className="text-center">
                          <img
                            key={i}
                            src={teamLogos[team.trim()] || teamIcon}
                            className="team-logo1"
                            alt={team}
                          />
                          <div className="text-white small fw-bold">{team.trim()}</div>
                          </div>
                        ))
                      : "No teams recorded"}
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

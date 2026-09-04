import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./Player_info.css";
import { api } from "../../Config";
import fallbackImg from "../../assets/images/PlAyer.png";
import teamIcon from "../../assets/images/football-team_16848377.png";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import titansLogo from "../../assets/teams/Team2.png";
import warriorsLogo from "../../assets/teams/Team1.png";
import kingsLogo from "../../assets/teams/Team3.png";
import knightsLogo from "../../assets/teams/Team4.png";
import { getImageUrl } from "../../Utils/constants";
import { useAuth } from "../../context/AuthContext";

const teamLogos = {
  "JPL Titan": titansLogo,
  "JPL Warriors": warriorsLogo,
  "JPL Kings": kingsLogo,
  "JPL Knights": knightsLogo,
};

const Player_info = () => {
  const { id } = useParams();
  const [searcParams] = useSearchParams();
  const role = searcParams.get("role") || "player";
  const navigate = useNavigate();
  const { user } = useAuth();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
  const loadPlayer = async () => {
    try {
      const res = await api.get(`/players/${id}?role=${role}`);
      setPlayer(res.data.data);
    } catch (err) {
      console.error(err);
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  };

  loadPlayer();
}, [id, role]);

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
                src={getImageUrl(player.image_path) || fallbackImg}
                alt={player?.name || "Player photo"}
                className="player-image img-fluid"
                onError={(e) => (e.target.src = fallbackImg)}
              />
            </div>

            {/* Player Details */}
            <div className="col-md-9">
              {user?.role === "admin" && (
                <div className="d-flex justify-content-end mb-3">
                  <button
                    className="btn btn-warning fw-bold px-3 py-2 shadow-sm d-flex align-items-center gap-2"
                    onClick={() => navigate(`/admin_register?edit=${player.id || id}`, { state: { player } })}
                    style={{ borderRadius: "8px" }}
                  >
                    ✏️ Edit Player Details
                  </button>
                </div>
              )}
              <div className="row g-3">
                <div className="col-md-6 info-box green">
                  <div className="label">Player Name</div>
                  <div className="value">{player.name}</div>
                </div>
                {/*<div className="col-md-3 info-box green">
                  <div className="label">Jersey No</div>
                  <div className="value">{player.jersey}</div>
                </div>*/}
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
                {/*<div className="col-md-3 stat-box orange">
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
                </div>*/}

                {/* Teams */}
                <div className="col-12 team-box">
                  <div className="label bg-primary text-white p-2 rounded">
                    Played for Teams
                  </div>
                  <div className="d-flex gap-3 mt-2 flex-wrap">
                    
                     {player.teams_played
                      ? player.teams_played?.split(",").map((team) => (
                          <div key={team.trim()} className="text-center">
                          <img
                            src={teamLogos[team.trim()] || teamIcon}
                            className="team-logo1"
                            alt={`${team.trim()} logo`}
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

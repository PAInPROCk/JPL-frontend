import Navbar from "../../components/Navbar";
import "./Team_Info.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTeams } from "./TeamData";
import fallbackImg from "../../assets/images/football-team_16848377.png";

import { API_BASE_URL } from "../../Utils/constants";

const Team_info = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadTeam = async () => {
      const teams = await fetchTeams();
      const foundTeam = teams.find((t) => t.team_id.toString() === id);

      setTeam(foundTeam || null);

      // ✅ NEW: fetch players of this team
      try {
        const res = await fetch(`${API_BASE_URL}/team/${id}`);
        const data = await res.json();
        setPlayers(data.players || []);
      } catch (err) {
        console.error("Error fetching players:", err);
        setPlayers([]);
      }

      setLoading(false);
    };

    loadTeam();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-5">
          <h2>Loading team...</h2>
        </div>
      </>
    );
  }
  if (!team) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-5 text-danger">
          <h2>Team Not Found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="team-info-bg">
        <div className="container team-info-container shadow p-4 rounded">
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <img
                src={
                  team.image_path
                    ? `${API_BASE_URL}/${team.image_path}`
                    : fallbackImg
                }
                alt={team.name}
                className="team-image img-fluid"
                onError={(e) => (e.target.src = fallbackImg)}
              />
            </div>

            <div className="col-md-9">
              <div className="row g-3">
                <div className="col-md-6 info-box orange">
                  <div className="label">Team Name</div>
                  <div className="value">{team.name}</div>
                </div>
                <div className="col-md-6 info-box orange">
                  <div className="label">Captain</div>
                  <div className="value">{team.captain || "--"}</div>
                </div>
                <div className="col-md-3 info-box orange">
                  <div className="label">Team Rank</div>
                  <div className="value">{team.rank || "--"}</div>
                </div>
                <div className="col-md-3 info-box green">
                  <div className="label">Total Budget</div>
                  <div className="value">{team.Total_Budget || "--"}</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Current Season Budget</div>
                  <div className="value">{team.Season_Budget || "--"}</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Players Bought</div>
                  <div className="value">{team.players_bought || "--"}</div>
                </div>
                <div className="container mt-4">
                  <h3 className="text-white mb-3">
                    Players Bought ({players.length}/8)
                  </h3>
                  {players.length === 0 ? (
                    <p className="text-white">No players bought yet.</p>
                  ) : (
                    <div className="d-flex overflow-auto gap-3 pb-2">
                      {players.map((p) => (
                        <div key={p.player_id} className="col-auto d-flex">
                          <div className="card shadow-sm text-center p-2 h-100 player-card-fixed">
                            <img
                              src={
                                p.image_path
                                  ? `${API_BASE_URL}/${p.image_path}`
                                  : fallbackImg
                              }
                              alt={p.name}
                              className="img-fluid rounded"
                              style={{ height: "120px", objectFit: "cover" }}
                              onError={(e) => (e.target.src = fallbackImg)}
                            />
                            <h5 className="mt-2">{p.name}</h5>
                            <p className="text-muted mb-1">{p.category}</p>
                            <p className="text-success">₹{p.sold_price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

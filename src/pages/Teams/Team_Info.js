import Navbar from "../../components/Navbar";
import './Team_Info.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTeams } from "./TeamData";
import fallbackImg from "../../assets/images/football-team_16848377.png";


const Team_info = () => {
  const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";
  const {id} = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    const loadTeam = async () =>{
      const teams = await fetchTeams();
      const foundTeam = teams.find((t) => t.team_id.toString() === id);
      setTeam(foundTeam || null);
      setLoading(false);
    };
    loadTeam();
  }, [id]);

  if(loading){
    return(
      <>
      <Navbar/>
      <div className="text-center mt-5">
        <h2>Loading team...</h2>
      </div>
      </>
    )
  }
  if(!team){
    return(
      <>
        <Navbar/>
        <div className="text-center mt-5 text-danger">
          <h2>Team Not Found</h2>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="team-info-bg">
        <div className="container team-info-container shadow p-4 rounded">
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <img
                src={team.image_path ? `${API_BASE_URL}/${team.image_path}` : fallbackImg}
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
                <div className="col-md-3 info-box orange">
                  <div className="label">Team Rank</div>
                  <div className="value">{team.rank}</div>
                </div>
                <div className="col-md-3 info-box green">
                  <div className="label">Total Budget</div>
                  <div className="value">{team.total_budget || "--"}</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Current Season Budget</div>
                  <div className="value">{team.current_budget || "--"}</div>
                </div>
                <div className="col-md-3 stat-box orange">
                  <div className="label">Players Bought</div>
                  <div className="value">{team.players_bought || "--"}</div>
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

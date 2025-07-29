import Navbar from "../../components/Navbar";
import './Team_Info.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTeams } from "./TeamData";
import fallbackImg from "../../assets/images/football-team_16848377.png";


const Team_info = () => {
  const {id} = useParams();
  const [team, setTeam] = useState(null);

  useEffect(() =>{
    const loadTeam = async () =>{
      const teams = await fetchTeams();
      const found = teams.find((t) => t.id.toString() === id);
      setTeam(found);
    };
    loadTeam();
  }, [id]);

  if(!team) return <p className="text-center mt-5">Loading team....</p>;

  return (
    <>
      <Navbar />
      <div className="team-info-bg">
        <div className="container team-info-container shadow p-4 rounded">
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <img
                src={team.logo_path || fallbackImg}
                alt={team.name}
                className="team-image img-fluid"
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
                  <div className="value">{team.budget || "--"}</div>
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

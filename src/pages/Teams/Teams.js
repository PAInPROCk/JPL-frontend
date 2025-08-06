import Navbar from "../../components/Navbar";
import './Teams.css';
import TeamCard from "../../components/TeamCard";
import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { fetchTeams } from "./TeamData";

const Teams = () =>{
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
    useEffect(() => {
          const loadTeams = async () =>{
              const data = await fetchTeams();
              setTeams(data);
              setLoading(false);
          };
      loadTeams();
      },[]);
    return (
      <>
        <Navbar />
        <div className="players-bg">
        <div className="players-page pt-5">
          <div className="container py-5">
            <div className="row justify-content-center">
              {teams.map((team) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" 
                key={team.id}
                onClick={() => navigate(`/team_info/${team.id}`)}
                style={{cursor: "pointer"}}
                >
                  <TeamCard team={team} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </>
    );
}

export default Teams;
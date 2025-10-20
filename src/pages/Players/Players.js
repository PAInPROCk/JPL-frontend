import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Players.css";
import PlayerCard from "../../components/PlayerCard";
import { fetchPlayers } from "./PlayerData";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
        const loadPlayers = async () =>{
            const data = await fetchPlayers();
            setPlayers(data);
            setLoading(false);
        };
    loadPlayers();
    },[]);

  return (
    <>
      <Navbar />
      <div className="players-bg">
        <div className="players-page pt-5">
          <div className="container py-5">
            {loading ? (
              <p className="text-center">Loading Players</p>
            ) : (
            
            <div className="row justify-content-center">
              {players.map((player) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  key={player.player_id}
                  onClick={() => navigate(`/Player_info/${player.player_id}`)}
                  
                  style={{ cursor: "pointer" }}
                >
                  <PlayerCard player={player} />
                </div>
              ))}  
            </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Players;

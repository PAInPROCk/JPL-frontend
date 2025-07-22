import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import "./Players.css";
import players from "./PlayerData";
import PlayerCard from "../../components/PlayerCard";

const Players = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="players-bg">
        <div className="players-page pt-5">
          <div className="container py-5">
            <div className="row justify-content-center">
              {players.map((player) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  key={player.id}
                  onClick={() => navigate(`/player_info/${player.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <PlayerCard player={player} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Players;

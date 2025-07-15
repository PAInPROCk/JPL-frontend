import React from "react";
import fallbackImg from "../assets/images/PlAyer.png"; // your alt image
import { useNavigate} from "react-router-dom";

const PlayerCard = ({ player }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/player_info");
  };

  return (
    <div className="player-card text-center p-3" >
      <img
        src={player.img  || fallbackImg} 
        onError={(e) => (e.target.src = fallbackImg)}
        alt={player.img}
        className="img-fluid rounded-circle mb-2"
        style={{width: "150px", height: "150px", objectFit: "cover"}}
      />
      <h5>{player.name}</h5>
      <p className="text-muted">#{ player.jersey}</p>
      <button onClick={handleClick} className="btn btn-primary btn-sm">Info</button>
    </div>
  );
};

export default PlayerCard;

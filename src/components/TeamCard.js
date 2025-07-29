import fallbackImg from "../assets/images/football-team_16848377.png"; // your alt image
import { useNavigate} from "react-router-dom";

const TeamCard = ({ team }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/team_info/${team.id}`);
  };

  return (
    <div className="player-card text-center p-3" >
      <img
        src={team.img  || fallbackImg} 
        onError={(e) => (e.target.src = fallbackImg)}
        alt={team.img}
        className="img-fluid rounded-circle mb-2"
        style={{width: "150px", height: "150px", objectFit: "cover"}}
      />
      <h5>{team.name}</h5>
      <p className="text-muted">#{ team.jersey}</p>
      <button onClick={handleClick} className="btn btn-primary btn-sm">Info</button>
    </div>
  );
};

export default TeamCard;

import fallbackImg from "../assets/images/PlAyer.png";

const PlayerCard = ({ player }) => {
  return (
    <div className="player-card text-center p-3">
      <img
        src={player.image_path || fallbackImg}
        onError={(e) => (e.target.src = fallbackImg)}
        alt={player.name}
        className="img-fluid rounded-circle mb-2"
        style={{ width: "150px", height: "150px", objectFit: "cover" }}
      />
      <h5>{player.name}</h5>
      <p className="text-muted fw-bold">{player.jersey}</p>
    </div>
  );
};

export default PlayerCard;

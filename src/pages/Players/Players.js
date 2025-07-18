import Navbar from "../../components/Navbar";

import "./Players.css";

import PlayerCard from "../../components/PlayerCard";

const Players = () => {
  const players = [
    { name: "Player 1", jersey: 10, image: "/assets/images/player1.png" }, 
    { name: "Player 2", jersey: 12, image: "/assets/images/player2.png" },
    { name: "Player 3", jersey: 7, image: "/assets/images/player3.png" },
    { name: "Player 4", jersey: 5, image: "/assets/images/player4.png" },
    { name: "Player 5", jersey: 19, image: "/assets/images/player5.png" },
    { name: "Player 1", jersey: 10, image: "/assets/images/player1.png" },
    { name: "Player 2", jersey: 12, image: "/assets/images/player2.png" },
    { name: "Player 3", jersey: 7, image: "/assets/images/player3.png" },
    { name: "Player 4", jersey: 5, image: "/assets/images/player4.png" },
    { name: "Player 5", jersey: 19, image: "/assets/images/player5.png" },
    // ...more players
  ];
  return (
    <>
      <Navbar />
      <div className="players-bg">
        <div className="players-page pt-5">
          <div className="container py-5">
            <div className="row justify-content-center">
              {players.map((player, index) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
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

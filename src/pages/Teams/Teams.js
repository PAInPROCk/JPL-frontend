import Navbar from "../../components/Navbar";
import './Teams.css';
import TeamCard from "../../components/TeamCard";

const Teams = () =>{
  const teams = [
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
              {teams.map((team, index) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
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
console.log("Teams");
export default Teams;
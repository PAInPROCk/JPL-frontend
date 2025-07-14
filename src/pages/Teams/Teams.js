import Navbar from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';
import './Teams.css';

const Teams = () =>{
  const navigate = useNavigate();
    const handleClick = () => {
    navigate('/team_info');
    };
    return (
      <>
        <Navbar />
        <div className="teams-bg">
        <div className=" d-flex flex-row">
          <div className="card card-bg me-5" style={{ width: "18rem" }}>
            <img
              src="/assets/images/football-team_16848377.png"
              className="img-fluid img-opacity-100%"
              alt="..."
            />
            <div className="card-body">
              
              <p className="card-text"></p>
              <button onClick={handleClick} className="btn btn-primary">View Info</button>
            </div>
          </div>
          <div className="card card-bg me-5" style={{ width: "18rem" }}>
            <img
              src="/assets/images/football-team_16848377.png"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              
              <p className="card-text"></p>
              <button onClick={handleClick} className="btn btn-primary">View Info</button>
            </div>
          </div>
          <div className="card card-bg me-5" style={{ width: "18rem" }}>
            <img
              src="/assets/images/football-team_16848377.png"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              
              <p className="card-text"></p>
              <button onClick={handleClick} className="btn btn-primary">View Info</button>
            </div>
          </div>
          <div className="card card-bg" style={{ width: "18rem" }}>
            <img
              src="/assets/images/football-team_16848377.png"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              
              <p className="card-text"></p>
              <button onClick={handleClick} className="btn btn-primary">View Info</button>
            </div>
          </div>
        </div>
        </div>
      </>
    );
}
console.log("Teams");
export default Teams;
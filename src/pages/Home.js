import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';




const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
  navigate('/teams');
  };
  const auctionClick = () => {
  navigate('/auction');
  };
  const playersClick = () => {
  navigate('/players');
  };

  return (
    <div className="container mt-5">
      <Navbar />
      <div className="card" style={{width: '18rem'}}>
        <img src="/assets/images/football-team_16848377.png" className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title"></h5>
          <p className="card-text">
            
          </p>
          <button onClick={handleClick} className="btn btn-primary">View Teams</button>
          
        </div>
      </div>
      <div className="card" style={{width: '18rem'}}>
        <img src="/assets/images/auction_563673.png" className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title"></h5>
          <p className="card-text">
            
          </p>
          <button onClick={auctionClick} className="btn btn-primary">Auction</button>
          
        </div>
      </div>
      <div className="card" style={{width: '18rem'}}>
        <img src="/assets/images/PLAyer.png" className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title"></h5>
          <p className="card-text">
            
          </p>
          <button onClick={playersClick} className="btn btn-primary">Auction</button>
          
        </div>
      </div>
    </div>
  );
};

console.log("Home")
export default Home;

import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import './Home.css';



const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
  navigate('/teams');
  };
  const auctionClick = () => {
  navigate('/Auction_rule');
  };
  const playersClick = () => {
  navigate('/players');
  };

  return (
    <>
    <Navbar/>
    <div className='home-bg'>
    <div className="container d-flex p-2 mt-0 ">
      
      <div className="card card-bg card-f" style={{width: '18rem'}}>
        <img src="/assets/images/football-team_16848377.png" className="card-img-top" alt="..." />
        <div className="card-body">
          <p className="card-text">
            
          </p>
          <button onClick={handleClick} className="btn btn-primary">View Teams</button>
          
        </div>
      </div>
      <div className="card card-bg" style={{width: '18rem'}}>
        <img src="/assets/images/auction_563673.png" className="card-img-top" alt="..." />
        <div className="card-body">
          
          <p className="card-text">
            
          </p>
          <button onClick={auctionClick} className="btn btn-primary">Auction</button>
          
        </div>
      </div>
      <div className="card card-bg" style={{width: '18rem'}}>
        <img src="/assets/images/PLAyer.png" className="card-img-top" alt="..." />
        <div className="card-body">
          <p className="card-text">
          </p>
          <button onClick={playersClick} className="btn btn-primary">Players</button>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

console.log("Home")
export default Home;

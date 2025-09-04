import Navbar from "../../components/Navbar";
import "./Auction_rule.css";
import { useNavigate } from "react-router-dom";

const Auction_rule = () => {
    const navigate = useNavigate();
    const handleClick = () =>{
        navigate('/Waiting');
    };
  return (
    <>
      <Navbar />
      <div className="rules-bg">
        <div className="container rules-container text-white px-4 py-5">
          <h2 className="fw-bold mb-4">RULES:</h2>
          <div className="row mb-2">
            <div className="col">
              <p>
                📌 Lorem Ipsum is simply dummy text of the printing and
                typesetting industry.
              </p>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col">
              <p>
                📌 Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s.
              </p>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col">
              <p>
                📌 Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s.
              </p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <p>
                📌 Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s.
              </p>
            </div>
          </div>
          {/* Add more rules similarly */}
          <div className="text-center mt-5">
            <button onClick={handleClick} className="btn btn-success px-4 py-2 fw-bold">
              Proceed
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auction_rule;

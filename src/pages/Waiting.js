import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Waiting.css';
import Spinner from "../components/Spinner";

const Waiting = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate API call to check auction status
      fetch("http://localhost:5000/auction-status") // replace with your backend URL
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "started") {
            clearInterval(interval);
            navigate("/live-auction");
          }
        })
        .catch((err) => console.error(err));
    }, 2000); // check every 2 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [navigate]);

  return (
    <div className="waiting-bg d-flex flex-column justify-content-center align-items-center text-center vh-100">
      <div className="mb-4">
        <img
          src="/assets/images/cricket.png"
          alt="JPL Logo"
          width="80"
          height="80"
        />
        <h2 className="mt-2 text-white">JPL Auction</h2>
      </div>

      <div className="p-4 bg-dark bg-opacity-75 rounded shadow text-white">
        <p className="fs-5 mb-3">Waiting for Admin to Start Auction...</p>
        <Spinner />
      </div>
    </div>
  );
};

export default Waiting;

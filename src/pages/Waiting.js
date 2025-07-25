import NavbarComponent from "../components/Navbar";
import './Waiting.css';
import Spinner from "../components/Spinner";

const Waiting = () => {
  return (
    <>
      <NavbarComponent />
      <div className="waiting-bg">
      <div className="container-md mt-2 cont">
        <p className="p-5 text">Wait for Admin to Start Auction</p>
        <Spinner/>
      </div>
      </div>
    </>
  );
};

export default Waiting;

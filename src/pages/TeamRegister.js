import "./AdminRegister.css";
import axios from "axios";
import { useState } from "react";
import fallbackImg from "../assets/images/football-team_16848377.png"
import NavbarComponent from "../components/Navbar";

const TeamRegister = () => {

  const [text, setText] = useState('');
  const handleClickUpper = () => {
    let newText = text.toUpperCase();
    setText(newText);
  };

  const [formData, setFormData] = useState({
    teamName: "",
    teamRank: "",
    totalBudget: "",
    seasonBudget: "",
    playersBought: "",
    imagePath: "",
  });

  const [preview, setPreview] = useState(null);
  const [dropdownOpen, setdropDownOpen] = useState(false);
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const toggleDropdown = () => setdropDownOpen((open) => !open);

  const handleChange = (e) => {


    const { name, value, files } = e.target;

    if(name === "emailId"){
        setError("");
        const emailPattern= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!value){
          setError("Please Enter Email Address");
        }else if(!emailPattern.test(value)){
          setError("Invalid Email Format");
        }
    }

    if(name === "image" && files && files[0]){
      const file = files[0];
      setFormData({
        ...formData,
        image: file,
      });
      setPreview(URL.createObjectURL(file));
    } else{
    setFormData({
      ...formData,
      [name]: value,
    });
    }
  };

  const handleTeamCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      if (checked) {
        // add to array
        return { ...prev, teams: [...prev.teams, value] };
      } else {
        // remove from array
        return { ...prev, teams: prev.teams.filter((team) => team !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "teams") {
        formData.teams.forEach((team) => data.append("teams[]", team));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/add-Player`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(res.data.message || "Player Added Successfully");
      console.log("Upload Image:", res.data.image);
    } catch (err) {
      alert(err.response?.data?.error || "Something Went wrong");
    }
  };
  return (
    <>
      <div className="register-bg">
        <NavbarComponent/>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger mt-0" role="alert">
              {error}
            </div>
          )}
          <div className="container player-info-container shadow p-3  rounded register-rg">
            <div className="row g-5">
              {/* Team Image */}
              <div className="col-md-3 text-center">
                <img 
                  src={preview || fallbackImg}
                  alt="Team"
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px", objectFit: "cover"}}
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="form-control mt-2"
                />
              </div>

              {/* Team Details */}
              <div className="col-md-9 ">
                <div className="row g-3">
                  <div className="col-md-3 info-box green">
                    <div className="label">Team Name</div>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        placeholder="Enter Team Name"
                        type="text"
                        name="teamName"
                        value={formData.teamName}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="col-md-3 stat-box orange">
                    <div className="label">Team Rank</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="number"
                        name="teamRank"
                        placeholder="Enter Team Rank"
                        value={formData.teamRank}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 stat-box orange">
                    <div className="label">Total Budget</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="number"
                        name="totalBudget"
                        placeholder="Enter Teams total budget"
                        value={formData.totalBudget}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 stat-box orange">
                    <div className="label">Current Season Budget</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="number"
                        name="seasonBudget"
                        pattern="[0-9]{3}"
                        placeholder="Enter Current Season Budget"
                        value={formData.seasonBudget}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 stat-box orange">
                    <div className="label">Players Bought</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="number"
                        name="playersBought"
                        width="100%"
                        placeholder="Enter Total Players bought in current season"
                        value={formData.playersBought}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-c"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Submit form
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default TeamRegister;

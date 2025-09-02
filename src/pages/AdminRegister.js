import "./AdminRegister.css";
import axios from "axios";
import { useState } from "react";
import fallbackImg from "../assets/images/PlAyer.png"
import NavbarComponent from "../components/Navbar";

const AdminRegister = () => {

  const [text, setText] = useState('');
  const handleClickUpper = () => {
    let newText = text.toUpperCase();
    setText(newText);
  };

  const [formData, setFormData] = useState({
    playerName: "",
    fatherName: "",
    surName: "",
    jerseyNo: "",
    nickName: "",
    category: "",
    style: "",
    totalRuns: "",
    highestRuns: "",
    wickets: "",
    outs: "",
    role: "",
    mobile: "",
    emailId: "",
    age: "",
    gender: "",
    image: null,
    teams: [],
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
              {/* Player Image */}
              <div className="col-md-3 text-center">
                <img 
                  src={preview || fallbackImg}
                  alt="Player"
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

              {/* Player Details */}
              <div className="col-md-9 ">
                <div className="row g-3">
                  <div className="col-md-3 info-box green">
                    <div className="label">Player Name</div>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        placeholder="Enter Player Name"
                        type="text"
                        name="playerName"
                        value={formData.playerName}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <div className="label">Father Name</div>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        placeholder="Enter father name"
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <div className="label">Surname</div>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        placeholder="Enter Surname"
                        type="text"
                        name="surName"
                        value={formData.surName}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <div className="label">Jersey No</div>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        placeholder="Enter Jersey Number"
                        type="number"
                        name="jerseyNo"
                        value={formData.jerseyNo}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <div className="label">Nick Name</div>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        type="text"
                        placeholder="Enter Nick Name"
                        name="nickName"
                        pattern="[A-Z]"
                        value={formData.nickName}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <div className="label">Mobile Number</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="number"
                        placeholder="Enter Mobile Number without +91"
                        name="mobile"
                        pattern="[0-9]"
                        value={formData.mobile}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <div className="label">Email</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="email"
                        placeholder="Enter Email Address"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box red">
                    <div className="label">Role</div>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        placeholder="Enter Role of player"
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-6 info-box red">
                    <div className="label">Player Category</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph"
                        type="text"
                        name="category"
                        maxLength="1"
                        pattern="[A-Z]"
                        placeholder="Enter Category (A,B,C,D,...)"
                        value={formData.category}
                        onChange={handleChange}
                        onInput={handleClickUpper}
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-6 info-box red">
                    <div className="label">Style</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="text"
                        name="style"
                        placeholder="Enter Playing style (ex: Right Hand Spinner)"
                        value={formData.style}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>


                  {/* Stats */}
                  <div className="col-md-3 stat-box orange">
                    <div className="label">Total Runs</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="number"
                        name="totalRuns"
                        placeholder="Enter Total Runs made in Career"
                        value={formData.totalRuns}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 stat-box orange">
                    <div className="label">Highest Runs</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="number"
                        name="highestRuns"
                        placeholder="Enter Highest Runs made in a single match"
                        value={formData.highestRuns}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 stat-box orange">
                    <div className="label">Wickets Taken</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="number"
                        name="wickets"
                        pattern="[0-9]{3}"
                        placeholder="Enter Wickets Taken by player"
                        value={formData.wickets}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 stat-box orange">
                    <div className="label">Being Out</div>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="number"
                        name="outs"
                        width="100%"
                        placeholder="Enter number of times player has been out"
                        value={formData.outs}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="col-6 team-box">
                    <div className="label bg-primary text-white p-2 rounded mb-2">
                      Played for Teams
                    </div>

                    <div className="dropdown dropup">
                      <button
                        className="btn btn-outline-primary dropdown-toggle"
                        type="button"
                        onClick={toggleDropdown}
                        aria-expanded={dropdownOpen}
                      >
                        {formData.teams.length === 0
                          ? "Select Teams"
                          : formData.teams.join(", ")}
                      </button>
                      <ul
                        className={`dropdown-menu p-2 custom-dropdown-menu${
                          dropdownOpen ? " show" : ""
                        }`}
                      >
                        {["JPL Titan", "JPL Warriors", "JPL Kings","JPL Knights"].map(
                          (team) => (
                            <li key={team}>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`team-${team}`}
                                  value={team}
                                  checked={formData.teams.includes(team)}
                                  onChange={handleTeamCheckboxChange}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`team-${team}`}
                                >
                                  {team}
                                </label>
                              </div>
                            </li>
                          )
                        )}
                      </ul>
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

export default AdminRegister;

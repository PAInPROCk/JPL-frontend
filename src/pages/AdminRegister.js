import "./AdminRegister.css";
import axios from "axios";
import { useState } from "react";

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

  const [dropdownOpen, setdropDownOpen] = useState(false);

  const toggleDropdown = () => setdropDownOpen((open) => !open);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
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
        "http://localhost:5000/api/admin/addPlayer",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(res.data.message || "Player Added Successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Something Went wrong");
    }
  };
  return (
    <>
      <div className="register-bg">
        <form onSubmit={handleSubmit}>
          <div className="container player-info-container shadow p-4 rounded register-rg">
            <div className="row g-4">
              {/* Player Image */}
              <div className="col-md-3 text-center">
                <img />
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
                        className="border-1"
                        type="number"
                        placeholder="Enter Mobile Number without +91"
                        name="mobile"
                        pattern="[0-9]"
                        value={formData.mobile}
                        onChange={handleChange}
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
                        className="border-1"
                        type="text"
                        name="category"
                        maxLength="1"
                        pattern="[A-Z]"
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
                        className="border-1"
                        type="text"
                        name="style"
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
                        className="border-1"
                        type="number"
                        name="totalRuns"
                        value={formData.totalRuns}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 stat-box orange">
                    <div className="label">Highest Runs</div>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        type="number"
                        name="highestRuns"
                        value={formData.highestRuns}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 stat-box orange">
                    <div className="label">Wickets Taken</div>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        type="number"
                        name="wickets"
                        pattern="[0-9]{3}"
                        value={formData.wickets}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 stat-box orange">
                    <div className="label">Being Out</div>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        type="number"
                        name="outs"
                        value={formData.outs}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="col-12 team-box">
                    <div className="label bg-primary text-white p-2 rounded mb-2">
                      Played for Teams
                    </div>

                    <div className="dropdown">
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
                        {["JPL Titan", "JPL Warriors", "JPL Kings"].map(
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

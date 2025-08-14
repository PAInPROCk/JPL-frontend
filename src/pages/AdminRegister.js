import "./AdminRegister.css";
import axios from "axios";
import { useState } from "react";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    playerName: "",
    jerseyNo: "",
    nickName: "",
    category: "",
    style: "",
    totalRuns: "",
    highestRuns: "",
    wickets: "",
    outs: "",
    image: null,
    teams: []
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleTeamCheckboxChange = (e) => {
  const { value, checked } = e.target;

  setFormData(prev => {
    if (checked) {
      // add to array
      return { ...prev, teams: [...prev.teams, value] };
    } else {
      // remove from array
      return { ...prev, teams: prev.teams.filter(team => team !== value) };
    }
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
        if(key === "teams"){
            formData.teams.forEach((team) => data.append("teams[]", team));
        } else{
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
          <div className="container player-info-container shadow p-4 rounded">
            <div className="row g-4">
              {/* Player Image */}
              <div className="col-md-3 text-center">
                <img />
              </div>

              {/* Player Details */}
              <div className="col-md-9">
                <div className="row g-3">
                  <div className="col-md-6 info-box green">
                    <div className="label">Player Name</div>
                    <div className="value p-1">
                      <input
                        className="border-1 pn"
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
                    <div className="label">Jersey No</div>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        placeholder="Enter Jersey Number"
                        type="text"
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
                        name="nickname"
                        value={formData.nickName}
                        onChange={handleChange}
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
                        value={formData.category}
                        onChange={handleChange}
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
                        name="wicketsTaken"
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
                        value={formData.outs}
                      ></input>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="col-12 team-box border p-1">
                    <div className="label bg-primary text-white p-2 rounded">
                      Played for Teams
                    </div>
                    <div className="d-flex gap-3 mt-2 flex-wrap">
                        {["JPL Titan", "JPL Warriors", "JPL Kings"].map(team => (
                        <div key={team} className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value={team}
                                id={team}
                                checked={formData.teams.includes(team)}
                                onChange={handleTeamCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor={team}>
                            {team}
                            </label>
                    </div>
                     ))}
                </div>
                
              </div>
              <button className="btn btn-primary btn-c" type="submit" onClick={handleSubmit}>
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

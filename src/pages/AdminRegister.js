import "./AdminRegister.css";
import { useReducer, useEffect } from "react";
import fallbackImg from "../assets/images/PlAyer.png";
import NavbarComponent from "../components/Navbar";
import { api } from "../Config";

const initialState = {
  formData: {
    playerName: "",
    fatherName: "",
    surName: "",
    jerseyNo: "",
    nickName: "",
    category: "",
    style: "",
    totalRuns: "",
    highestRuns: "",
    basePrice: "",
    wickets: "",
    outs: "",
    role: "",
    mobile: "",
    emailId: "",
    age: "",
    gender: "",
    image: null,
    teams: [],
  },
  loading: true,
  teams: [],
  preview: null,
  dropdownOpen: false,
  error: "",
};

function adminRegisterReducer(state, action) {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, formData: action.value };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "SET_TEAMS":
      return { ...state, teams: action.value };
    case "SET_PREVIEW":
      return { ...state, preview: action.value };
    case "TOGGLE_DROPDOWN":
      return { ...state, dropdownOpen: !state.dropdownOpen };
    case "SET_ERROR":
      return { ...state, error: action.value };
    default:
      return state;
  }
}

const AdminRegister = () => {
  const [state, dispatch] = useReducer(adminRegisterReducer, initialState);
  const { formData, teams, preview, dropdownOpen, error } = state;

  const handleClickUpper = () => {
    dispatch({
      type: "SET_FORM_DATA",
      value: {
        ...formData,
        category: formData.category.toUpperCase(),
      },
    });
  };

  const toggleDropdown = () => dispatch({ type: "TOGGLE_DROPDOWN" });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get("/teams");
        dispatch({ type: "SET_TEAMS", value: Array.isArray(res.data) ? res.data : [] });
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        dispatch({ type: "SET_LOADING", value: false });
      }
    };
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "emailId") {
      dispatch({ type: "SET_ERROR", value: "" });
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        dispatch({ type: "SET_ERROR", value: "Please Enter Email Address" });
      } else if (!emailPattern.test(value)) {
        dispatch({ type: "SET_ERROR", value: "Invalid Email Format" });
      }
    }

    if (name === "image" && files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file");
        return;
      }
      dispatch({
        type: "SET_FORM_DATA",
        value: {
          ...formData,
          image: file,
        },
      });
      dispatch({ type: "SET_PREVIEW", value: URL.createObjectURL(file) });
    } else {
      dispatch({
        type: "SET_FORM_DATA",
        value: {
          ...formData,
          [name]: value,
        },
      });
    }
  };

  const handleTeamCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const newTeams = checked
      ? [...formData.teams, value]
      : formData.teams.filter((teamId) => teamId !== value);
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formData, teams: newTeams },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
  if (key === "teams") {
    formData.teams.forEach((teamId) =>
      data.append("teams", Number(teamId))
    );
  } else if (key === "image") {
    if (formData.image) {
      data.append("image", formData.image);
    }
  } else {
    if (formData[key] !== "" && formData[key] !== null) {
      data.append(key, formData[key]);
    }
  }
});

    try {
      const res = await api.post("/add-player", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(res.data.message || "Player Added Successfully");
    } catch (err) {
      alert(err.response?.data?.detail || err.response?.data?.error || "Something Went Wrong");
    }
  };
  return (
    <>
      <div className="register-bg">
        <NavbarComponent />
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger mt-0" role="alert">
              {error}
            </div>
          )}
          <div className="container player-info-container1 shadow p-3  rounded register-rg">
            <div className="row g-5">
              {/* Player Image */}
              <div className="col-md-3 text-center">
                <img
                  src={preview || fallbackImg}
                  alt="Player"
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="form-control mt-2"
                  id="playerImage"
                  aria-label="Upload Player Photo"
                />
              </div>

              {/* Team Details */}
              <div className="col-md-9 ">
                <div className="row g-3">
                  <div className="col-md-3 info-box green">
                    <label className="label" htmlFor="playerName">Player Name</label>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        placeholder="Enter Player Name"
                        type="text"
                        name="playerName"
                        id="playerName"
                        value={formData.playerName}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <label className="label" htmlFor="fatherName">Father Name</label>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        placeholder="Enter father name"
                        type="text"
                        name="fatherName"
                        id="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <label className="label" htmlFor="surName">Surname</label>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        placeholder="Enter Surname"
                        type="text"
                        name="surName"
                        id="surName"
                        value={formData.surName}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <label className="label" htmlFor="gender">Gender</label>
                    <div className="value p-1">
                      <select
                        className="form-select border-1 border-black"
                        name="gender"
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/*<div className="col-md-3 info-box green">
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
                  </div>*/}
                  <div className="col-md-3 info-box green">
                    <label className="label" htmlFor="nickName">Nick Name</label>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        type="text"
                        placeholder="Enter Nick Name"
                        name="nickName"
                        id="nickName"
                        pattern="[A-Z]"
                        value={formData.nickName}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <label className="label" htmlFor="mobile">Mobile Number</label>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="number"
                        placeholder="Enter Mobile Number without +91"
                        name="mobile"
                        id="mobile"
                        pattern="[0-9]"
                        value={formData.mobile}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-3 info-box green">
                    <label className="label" htmlFor="age">Age</label>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="number"
                        placeholder="Enter age of player"
                        name="age"
                        id="age"
                        pattern="[0-9]"
                        maxLength="2"
                        value={formData.age}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </div>
                  {/*<div className="col-md-3 info-box green">
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
                  </div>*/}
                  <div className="col-md-3 info-box red">
                    <label className="label" htmlFor="role">Role</label>
                    <div className="value p-1">
                      <input
                        className="border-1"
                        placeholder="Enter Role of player"
                        type="text"
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-6 info-box red">
                    <label className="label" htmlFor="category">Player Category</label>
                    <div className="value p-1">
                      <input
                        className="border-1 ph"
                        type="text"
                        name="category"
                        id="category"
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
                    <label className="label" htmlFor="style">Style</label>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="text"
                        name="style"
                        id="style"
                        placeholder="Enter Playing style (ex: Right Hand Spinner)"
                        value={formData.style}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="col-md-6 info-box red">
                    <label className="label" htmlFor="basePrice">Base Price</label>
                    <div className="value p-1">
                      <input
                        className="border-1 ph1"
                        type="text"
                        name="basePrice"
                        id="basePrice"
                        placeholder="Enter Base Price (in INR ₹)"
                        value={formData.basePrice}
                        onChange={handleChange}
                        required
                      ></input>
                    </div>
                  </div>

                  {/* Stats */}
                  {/*<div className="col-md-3 stat-box orange">
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
                  </div>*/}
                  {/*<div className="col-md-3 stat-box orange">
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
                  </div>*/}
                  {/*<div className="col-md-3 stat-box orange">
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
                  </div>*/}
                  {/*<div className="col-md-3 stat-box orange">
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
                  </div>*/}

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
                          : formData.teams
                            .map(
                              (teamId) => 
                                teams.find((t) => t.team_id === parseInt(teamId))?.name
                            )
                            .join(", ")}
                      </button>
                      <ul
                        className={`dropdown-menu p-2 custom-dropdown-menu${
                          dropdownOpen ? " show" : ""
                        }`}
                      >
                        {(Array.isArray(teams) ? teams : []).map((team) => (
                          <li key={team.id}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`team-${team.team_id}`}
                                aria-label={team.name}
                                value={team.team_id}
                                checked={formData.teams.includes(String(team.team_id))}
                                onChange={handleTeamCheckboxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`team-${team.team_id}`}
                              >
                                {team.name}
                              </label>
                            </div>
                          </li>
                        ))}
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

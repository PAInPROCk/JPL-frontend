import React, { useState } from "react";
import "./Admin.css";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import NavbarComponent from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const navigate = useNavigate();

  const [customFile, setCustomFile] = useState(null);
  const [auctionMode, setAuctionMode] = useState(null);
  const [playerList, setPlayerList] = useState([]);

  const requireAdmin = async (nextPath, extraState = {}) => {
    try {
      const res = await axios.get("http://localhost:5000/check-auth", {
        withCredentials: true,
      });
      if (res.data.authenticated && res.data.role === "admin") {
        navigate(nextPath, { state: extraState });
      } else {
        alert("Access denied: admin login required");
        navigate("/"); // Or show an error modal
      }
    } catch {
      alert("Access denied: Please login as admin");
      navigate("/");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const sorted = results.data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setPlayerList(sorted);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        const sorted = json.sort((a, b) => a.name.localeCompare(b.name));
        setPlayerList(sorted);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Only CSV or Excel files are allowed");
    }
  };

  const startAuction = () => {
    requireAdmin("/Admin_auction", {
      state: {
        auctionMode,
        playerList: auctionMode === "custom" ? playerList : [],
      },
    });
  };

  const handleTeamRegistration = () => requireAdmin("/registerTeam");
  const handlePlayerRegistration = () => requireAdmin("/Admin_register");

  return (
    <>
      <NavbarComponent />
      <div className="admin-bg" style={{ minHeight: "100vh", paddingTop: 0 }}>
        <div className="container py-4">
          <h2 className="text-center mb-3 mt-1">Admin Panel</h2>
          <div className="admin-action-card">
            <div
              className="mb-3"
              style={{ fontWeight: 600, fontSize: 22, textAlign: "center" }}
            >
              Auction Setup & Registration
            </div>

            <div className="admin-option">
              <input
                type="checkbox"
                checked={auctionMode === "custom"}
                onChange={() => setAuctionMode("custom")}
                id="useCustomList"
              />
              <label htmlFor="useCustomList">Use Custom Player List</label>
            </div>
            {auctionMode === "custom" && (
              <div className="mb-2 ms-3">
                <label
                  htmlFor="customFile"
                  className="form-label"
                  style={{ fontSize: 16 }}
                >
                  Upload Custom Player List
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="customFile"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileUpload}
                />
                {customFile && (
                  <p className="text-muted mt-1">Selected: {customFile.name}</p>
                )}
                {playerList.length > 0 && (
                  <div className="mt-2 player-preview-box p-2 border-rounded">
                    <h6 style={{ fontWeight: 600 }}>Player Preview</h6>
                    <ul className="list-group">
                      {playerList.map((player, index) => (
                        <li key={index} className="list-group-item">
                          {player.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="admin-option">
              <input
                type="checkbox"
                checked={auctionMode === "random"}
                onChange={() => setAuctionMode("random")}
                id="randomMode"
              />
              <label htmlFor="randomMode">Random Mode</label>
            </div>
            <div className="admin-option">
              <input
                type="checkbox"
                checked={auctionMode === "unsold"}
                onChange={() => setAuctionMode("unsold")}
                id="unsoldPlayers"
              />
              <label htmlFor="unsoldPlayers">Use Unsold Players Only</label>
            </div>

            <button
              className="btn btn-success w-100"
              onClick={startAuction}
              disabled={!auctionMode}
            >
              Start Auction
            </button>

            <button
              className="btn btn-info w-100 mt-3"
              onClick={handleTeamRegistration}
            >
              New Team Registration
            </button>
            <button
              className="btn btn-info w-100 mt-2"
              onClick={handlePlayerRegistration}
            >
              New Player Registration
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;

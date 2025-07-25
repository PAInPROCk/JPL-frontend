import React, { use } from "react";
import { useState } from "react";
import "./Admin.css";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import NavbarComponent from "../components/Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isAdminLoggedIn) {
      navigate("/");
    }
  }, [navigate]);
  const [randomMode, setrandomMode] = useState(false);
  const [useCustomList, setuseCustomList] = useState(false);
  const [unsoldPlayers, setunsoldPlayers] = useState(false);
  const [customFile, setCustomFile] = useState(null);
  const [playerList, setPlayerList] = useState([]);

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
      alert("Only CSV or Excel fies are allowed");
    }
  };

  const startAuction = () => {
    navigate("/Admin_auction", {
      state: {
        randomMode,
        useCustomList,
        unsoldPlayers,
        playerList,
      },
    });
  };
  return (
    <>
      <NavbarComponent />
      <div className="admin-bg">
        <div className="container py-5">
          <h2 className="text-center mb-4 mt-3">Admin Panel</h2>
          <div className="admin-panel p-4 rounded shadow">
            <div className="mb-3">
              <span className="badge text-bg-custom">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={useCustomList}
                  onChange={() => setuseCustomList(!useCustomList)}
                />
                <label className="form-check-label me-2">
                  Use Custom Player List
                </label>
              </span>
            </div>
            {useCustomList && (
              <div className="mb-3">
                <label htmlFor="customFile" className="form-label">
                  Upload Custom Player List
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="customFile"
                  accept=".csv,.json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={handleFileUpload}
                />
                {customFile && (
                  <p className="text-muted mt-2">Selected: {customFile.name}</p>
                )}
                {playerList.length > 0 && (
                  <div className="mt-3 player-preview-box p-2 border-rounded">
                    <h5>Player Preview</h5>
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

            <div className="mb-3">
              <span className="badge text-bg-custom">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={randomMode}
                  onChange={() => setrandomMode(!randomMode)}
                />
                <label className="form-check-label me-2">Random Mode</label>
              </span>
            </div>
            <div className="mb-3">
              <span className="badge text-bg-custom">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={unsoldPlayers}
                  onChange={() => setunsoldPlayers(!unsoldPlayers)}
                />
                <label className="form-check-label me-2">
                  Use Unsold Players Only
                </label>
              </span>
            </div>
            <button className="btn btn-success mt-3" onClick={startAuction}>
              Start Auction
            </button>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;

import React, { use } from "react";
import { useState } from "react";
import './Admin.css';
import { Link } from "react-router-dom";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NavbarComponent from "../components/Navbar";

const Admin = () =>{
    const [randomMode, setrandomMode] = useState(false);
    const [useCustomList, setuseCustomList] = useState(false);
    const [unsoldPlayers, setunsoldPlayers] = useState(false);
    return(
        <>
            <NavbarComponent/>
            <div className="container py-5">
                <h2 className="text-center mb-4">
                    Admin Panel
                </h2>
                <div className="admin-panel p-4 rounded shadow">
                    <div className="mb-3">
                        <label className="form-check-label me-2">Use Custom Player List</label>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={useCustomList}
                            onChange={ () => setuseCustomList(!useCustomList)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-check-label me-2">Random Mode</label>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={randomMode}
                            onChange={ () => setrandomMode(!randomMode)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-check-label me-2">Use Unsold Players Only</label>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={unsoldPlayers}
                            onChange={() => setunsoldPlayers(!unsoldPlayers)}
                        />
                    </div>
                    <button className="btn btn-success mt-3" onClick={ () => console.log("Auction started")}> 
                        Start Auction
                    </button>
                </div>
            </div>
        </>
    )
}

export default Admin;
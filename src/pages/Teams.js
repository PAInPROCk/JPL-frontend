import React from "react";
import { Link } from "react-router-dom";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from "../components/Navbar";
import './AllTeams.css';

const Teams = () =>{
    return (
      <>
        <Navbar />
        <div className="allteams-bg">
          <div className="card" style={{ width: "18rem" }}>
            <img
              src="/assets/images/football-team_16848377.png"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              
              <p className="card-text"></p>
              <button className="btn btn-primary">View Info</button>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img
              src="/assets/images/football-team_16848377.png"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              
              <p className="card-text"></p>
              <button className="btn btn-primary">View Info</button>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img
              src="/assets/images/football-team_16848377.png"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              
              <p className="card-text"></p>
              <button className="btn btn-primary">View Info</button>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img
              src="/assets/images/football-team_16848377.png"
              className="card-img-top"
              alt="..."
            />
            <div className="card-body">
              
              <p className="card-text"></p>
              <button className="btn btn-primary">View Info</button>
            </div>
          </div>
        </div>
        
      </>
    );
}
console.log("Teams");
export default Teams;
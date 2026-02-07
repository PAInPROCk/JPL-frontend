import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Auction from "../pages/Auction/Auction";
import Players from "../pages/Players/Players";
import Teams from "../pages/Teams/Teams";
import Register from "../pages/Register";
import Team_Info from "../pages/Teams/Team_Info";
import Player_info from "../pages/Players/Player_info";
import Auction_rule from "../pages/Auction/Auction_rule";
import Sold from "../components/Sold";
import Unsold from "../components/Unsold";
import Waiting from "../pages/Waiting";
import HomePage from "../pages/HomePage/HomePage";
import Admin_auction from "../pages/Admin_auction";
import AdminRegister from "../pages/AdminRegister";
import TeamRegister from "../pages/TeamRegister";

import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* TEAM / LOGGED IN */}
      <Route element={<ProtectedRoute allowedRoles={["team", "admin"]} />}>
        <Route path="/home" element={<Home />} />
        <Route path="/sold" element={<Sold />} />
        <Route path="/unsold" element={<Unsold />} />
        <Route path="/waiting" element={<Waiting />} />
      </Route>

      {/* PUBLIC (no guard) */}
      <Route path="/auction" element={<Auction />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/players" element={<Players />} />
      <Route path="/player_info/:id" element={<Player_info />} />
      <Route path="/team_info/:id" element={<Team_Info />} />
      <Route path="/auction_rule" element={<Auction_rule />} />

      {/* ADMIN ONLY */}
      <Route element={<AdminProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<Admin />}/>
        <Route path="/admin_auction" element={<Admin_auction />} />
        <Route path="/admin_register" element={<AdminRegister />} />
        <Route path="/team_register" element={<TeamRegister />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;

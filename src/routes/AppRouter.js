import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/Login';
import Navbar from '../components/Navbar';
import Admin from '../pages/Admin';
import Auction from '../pages/Auction';
import Players from '../pages/Players/Players';
import Teams from '../pages/Teams/Teams';
import Register from '../pages/Register';
import Team_Info from '../pages/Teams/Team_Info';

const AppRouter = () =>{
    return(
            <Routes>
                <Route path="/" element={<Login/>}/> 
                <Route path="/register" element={<Register/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/admin" element={<Admin/>}/>
                <Route path="/auction" element={<Auction/>}/>
                <Route path="/teams" element={<Teams/>}/>
                <Route path="/players" element={<Players/>}/> 
                <Route path="/team_info" element={<Team_Info/>}/>
            </Routes>
    )
}

export default AppRouter;
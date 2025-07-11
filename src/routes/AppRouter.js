import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/Login';
import Navbar from '../components/Navbar';
import Admin from '../pages/Admin';
import Auction from '../pages/Auction';
import Players from '../pages/Players';
import Teams from '../pages/Teams';
import Register from '../pages/Register';

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
            </Routes>
    )
}

export default AppRouter;
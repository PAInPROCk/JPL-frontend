import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/Login';
import Admin from '../pages/Admin';
import Auction from '../pages/Auction/Auction';
import Players from '../pages/Players/Players';
import Teams from '../pages/Teams/Teams';
import Register from '../pages/Register';
import Team_Info from '../pages/Teams/Team_Info';
import Player_info from '../pages/Players/Player_info';
import Auction_rule from '../pages/Auction/Auction_rule';
import Sold from '../components/Sold';
import ProtectedRoute from './ProtectedRoute';
import Admin_auction from '../pages/Admin_auction';
import Waiting from '../pages/Waiting';
import HomePage from '../pages/HomePage/HomePage';

const AppRouter = () =>{
    return(
            <Routes>
                <Route path='/' element={<HomePage/>}/>
                <Route path="/login" element={<Login/>}/> 
                <Route path="/register" element={<Register/>}/>
                <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
                <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>}/>
                <Route path="/auction" element={<ProtectedRoute><Auction/></ProtectedRoute>}/>
                <Route path="/teams" element={<ProtectedRoute><Teams/></ProtectedRoute>}/>
                <Route path="/players" element={<ProtectedRoute><Players/></ProtectedRoute>}/> 
                <Route path='/Player_info/:id' element={<ProtectedRoute><Player_info/></ProtectedRoute>}/>
                <Route path="/team_info/:id" element={<ProtectedRoute><Team_Info/></ProtectedRoute>}/>
                <Route path='/Auction_rule' element={<ProtectedRoute><Auction_rule/></ProtectedRoute>}/>
                <Route path="/Sold" element={<ProtectedRoute><Sold/></ProtectedRoute>}/>
                <Route path='/Admin_auction' element={<ProtectedRoute><Admin_auction/></ProtectedRoute>}/>
                <Route path='/Waiting' element={<ProtectedRoute><Waiting/></ProtectedRoute>}/>
            </Routes>
    )
}

export default AppRouter;
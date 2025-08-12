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
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminRegister from '../pages/AdminRegister';


const AppRouter = () =>{
    return(
            <Routes>
                <Route path='/' element={<HomePage/>}/>
                <Route path="/login" element={<Login/>}/> 
                <Route path="/register" element={<Register/>}/>

                {/* User Protected Routes */}
                <Route path="/home" element={<ProtectedRoute allowedRoles={["user", "admin"]}><Home/></ProtectedRoute>}/>
                <Route path="/auction" element={<ProtectedRoute allowedRoles={["user", "admin"]}><Auction/></ProtectedRoute>}/>
                <Route path="/teams" element={<ProtectedRoute allowedRoles={["user", "admin"]}><Teams/></ProtectedRoute>}/>
                <Route path="/players" element={<ProtectedRoute allowedRoles={["user", "admin"]}><Players/></ProtectedRoute>}/> 
                <Route path='/Player_info/:id' element={<ProtectedRoute allowedRoles={["user", "admin"]}><Player_info/></ProtectedRoute>}/>
                <Route path="/team_info/:id" element={<ProtectedRoute allowedRoles={["user", "admin"]}><Team_Info/></ProtectedRoute>}/>
                <Route path='/Auction_rule' element={<ProtectedRoute allowedRoles={["user", "admin"]}><Auction_rule/></ProtectedRoute>}/>
                <Route path="/Sold" element={<ProtectedRoute allowedRoles={["user", "admin"]}><Sold/></ProtectedRoute>}/>
                <Route path='/Waiting' element={<ProtectedRoute allowedRoles={["user", "admin"]}><Waiting/></ProtectedRoute>}/>

                {/* Admin Protected Routes */}
                <Route path="/admin" element={<AdminProtectedRoute allowedRoles={["admin"]}><Admin/></AdminProtectedRoute>}/>
                <Route path='/Admin_auction' element={<ProtectedRoute allowedRoles={["admin"]}><Admin_auction/></ProtectedRoute>}/>
                <Route path='/Admin_register' element={<AdminRegister/>}/>
            </Routes>
    )
}

export default AppRouter;
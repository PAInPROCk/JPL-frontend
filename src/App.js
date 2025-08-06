import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppRouter from './routes/AppRouter';
import { Navigate } from "react-router-dom";
import ProtectedRoute from './routes/ProtectedRoute';


function App() {
  return (
    <>
    <AppRouter/>
    </>
  );
}

export default App;

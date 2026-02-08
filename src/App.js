import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AppRouter from './routes/AppRouter';
import axios from 'axios';
axios.defaults.withCredentials = true;


function App() {
  return (
    <>
    <AppRouter/>
    </>
  );
}
// console.log("API BASE URL:", process.env.REACT_APP_API_BASE_URL);
export default App;

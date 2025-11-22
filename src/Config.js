// Config.js
const api = process.env.REACT_APP_API_BASE_URL;

const API_BASE_URL = api
  ? api
  : window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : `http://${window.location.hostname}:5000`;

export default API_BASE_URL;

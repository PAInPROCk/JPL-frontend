import axios from "axios";
import API_BASE_URL from "../../Config.js";

export const fetchPlayers = async () => {
  // ✅ Fix typo & use proper fallback URL

  try {
    // ✅ Call the updated backend route
    const response = await axios.get(`${API_BASE_URL}/players-with-teams`);
    return response.data;
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};

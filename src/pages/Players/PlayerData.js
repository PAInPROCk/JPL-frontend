import axios from "axios";

export const fetchPlayers = async () => {
  // ✅ Fix typo & use proper fallback URL
  const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

  try {
    // ✅ Call the updated backend route
    const response = await axios.get(`${API_BASE_URL}/players-with-teams`);
    return response.data;
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};

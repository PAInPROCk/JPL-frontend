import axios from "axios";
import { api } from "../../Config";

export const fetchPlayers = async () => {
  // ✅ Fix typo & use proper fallback URL

  try {
    // ✅ Call the updated backend route
    const response = await api.get("/players-with-teams");
    return response.data;
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};

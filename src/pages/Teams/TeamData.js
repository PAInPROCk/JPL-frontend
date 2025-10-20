import axios from "axios";

export const fetchTeams = async () => {
    const API_BASE_URL = process.env.APP_BASE_URL || "http://localhost:5000";
    try{
        const response = await axios.get(`${API_BASE_URL}/teams`);
        return response.data;
    }catch(error){
        console.error("Error Fetching Teams", error);
        return[];
    }
};
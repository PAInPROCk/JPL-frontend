import axios from "axios";
import API_BASE_URL from "../../Config.js";

export const fetchTeams = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/teams`);
        return response.data;
    }catch(error){
        console.error("Error Fetching Teams", error);
        return[];
    }
};
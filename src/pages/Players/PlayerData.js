import axios from "axios";

export const fetchPlayers = async () => {
    try{
        const response = await axios.get("http://127.0.0.1:5000/players");
        return response.data;
    }catch(error){
        console.error("Error Fetching players", error);
        return[];
    }
};
import axios from "axios";

export const fetchTeams = async () => {
    try{
        const response = await axios.get("http://127.0.0.1:5000/teams");
        return response.data;
    }catch(error){
        console.error("Error Fetching Teams", error);
        return[];
    }
};
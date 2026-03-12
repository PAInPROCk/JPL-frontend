import axios from "axios";
import { api } from "../../Config";

export const fetchTeams = async () => {
    try{
        const response = await api.get("/teams");
        return response.data.teams;
    }catch(error){
        console.error("Error Fetching Teams", error);
        return[];
    }
};
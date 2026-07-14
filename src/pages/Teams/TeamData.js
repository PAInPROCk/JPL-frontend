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

export const fetchTeamPlayers = async (id) => {
    try {
        const response = await api.get(`/team/${id}`);
        return response.data.players || [];
    } catch (error) {
        console.error("Error Fetching Team Players", error);
        return [];
    }
};
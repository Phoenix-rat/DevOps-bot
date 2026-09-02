import axios from "axios";

const api = axios.create({
    baseURL: process.env.HOST_STATS_URL,
    timeout: 5000
});

export async function getSystemStats() {
    const response = await api.get("/stats");

    return response.data;
}
import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.PTERODACTYL_URL}/api/client`,
    headers: {
        Authorization: `Bearer ${process.env.PTERODACTYL_API_KEY}`,
        Accept: "Application/vnd.pterodactyl.v1+json",
        "Content-Type": "application/json"
    }
});

export async function getServersList() {
    const response = await api.get("/");
    return response.data.data;
}

export async function getServerStatus(serverId) {
    const response = await api.get(`/servers/${serverId}/resources`);
    return response.data.attributes;
}

export async function getServerResources(serverId) {
    const response = await api.get(`/servers/${serverId}/resources`);
    const resources = response.data.attributes.resources;
    return {
        cpu: resources.cpu_absolute,
        memory: resources.memory_bytes,
        disk: resources.disk_bytes,
        networkRx: resources.network_rx_bytes,
        networkTx: resources.network_tx_bytes
    };
}

export async function sendServerPowerAction(serverId, action) {
    await api.post(`/servers/${serverId}/power`, { signal: action });
}
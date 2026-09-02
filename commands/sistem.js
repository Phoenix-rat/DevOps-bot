import { getSystemStats } from "../services/system.js";

export const name = "sistem";

export async function execute(message, args, client) {
    try {
        const stats = await getSystemStats();

        const ramTotal = (stats.memory.total / 1024 / 1024 / 1024).toFixed(2);
        const ramUsed = (stats.memory.used / 1024 / 1024 / 1024).toFixed(2);
        const ramPercent = ((stats.memory.used / stats.memory.total) * 100).toFixed(1);

        const diskTotal = (stats.disk.total / 1024 / 1024 / 1024).toFixed(2);
        const diskUsed = (stats.disk.used / 1024 / 1024 / 1024).toFixed(2);
        const diskPercent = ((stats.disk.used / stats.disk.total) * 100).toFixed(1);

        const totalSeconds = Math.floor(stats.uptime);

        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        const uptime = `${days}g ${hours}s ${minutes}dk`;

        const temperature = stats.temperature.main !== null ? `${stats.temperature.main}°C` : "Bilinmiyor";

        return message.reply(
            `**Ubuntu Host Sistemi**\n\n` +
            `CPU: \`${stats.cpu.usage}%\`\n` +
            `RAM: \`${ramUsed} / ${ramTotal} GB (${ramPercent}%)\`\n` +
            `Disk: \`${diskUsed} / ${diskTotal} GB (${diskPercent}%)\`\n` +
            `Sıcaklık: \`${temperature}\`\n` +
            `Uptime: \`${uptime}\``
        );

    } catch (error) {
        console.error(error.response?.data || error.message || error);
        return message.reply("Ubuntu host sistem bilgilerine ulaşılamadı.");
    }
}


import {
    getServerStatus,
    getServerResources,
    sendServerPowerAction,
    getServersList
} from "../services/pterodactyl.js";

export const name = "sunucu";

export async function execute(message, args, client) {
    const subcommand = args.shift()?.toLowerCase();

    if (subcommand === "liste") {
        try {
            const servers = await getServersList();
            if (!servers || servers.length === 0) {
                return message.reply("Hesaba kayıtlı sunucu bulunamadı.");
            }

            const serverList = servers.map(server => 
                `**İsim:** ${server.attributes.name} \n**ID:** \`${server.attributes.identifier}\``
            ).join('\n\n');

            return message.reply(`**Sunucu Listesi:**\n\n${serverList}`);
        } catch (error) {
            console.error(error.response?.data || error);
            return message.reply("Sunucu listesi alınırken hata oluştu.");
        }
    }

    const serverId = args.shift();

    if (!serverId && ["durum", "başlat", "durdur", "yenidenbaşlat", "kaynak"].includes(subcommand)) {
        return message.reply(`Lütfen bir sunucu ID'si belirtin. Örnek: \`!sunucu ${subcommand} <id>\``);
    }

    switch (subcommand) {
        case "durum": {
            try {
                const server = await getServerStatus(serverId);
                const state = server.current_state;

                const status = {
                    running: "🟢 Çalışıyor",
                    starting: "🟡 Başlatılıyor",
                    stopping: "🟠 Durduruluyor",
                    offline: "🔴 Kapalı"
                };

                return message.reply(`**Sunucu Durumu (${serverId})**\n\nDurum: ${status[state] ?? state}`);
            } catch (error) {
                console.error(error.response?.data || error);
                return message.reply("Pterodactyl API'sine bağlanırken hata oluştu veya sunucu bulunamadı.");
            }
        }

        case "başlat": {
            try {
                await sendServerPowerAction(serverId, "start");
                return message.reply(`🟢 Sunucu (${serverId}) başlatma isteği gönderildi.`);
            } catch (error) {
                console.error(error.response?.data || error);
                return message.reply("Sunucu başlatılırken bir hata oluştu.");
            }
        }

        case "durdur": {
            try {
                await sendServerPowerAction(serverId, "stop");
                return message.reply(`🟠 Sunucu (${serverId}) durdurma isteği gönderildi.`);
            } catch (error) {
                console.error(error.response?.data || error);
                return message.reply("Sunucu durdurulurken bir hata oluştu.");
            }
        }

        case "yenidenbaşlat": {
            try {
                await sendServerPowerAction(serverId, "restart");
                return message.reply(`🟡 Sunucu (${serverId}) yeniden başlatma isteği gönderildi.`);
            } catch (error) {
                console.error(error.response?.data || error);
                return message.reply("Sunucu yeniden başlatılırken bir hata oluştu.");
            }
        }

        case "kaynak": {
            try {
                const resources = await getServerResources(serverId);

                const memoryGB = (resources.memory / 1024 / 1024 / 1024).toFixed(2);
                const diskGB = (resources.disk / 1024 / 1024 / 1024).toFixed(2);
                const networkRxMB = (resources.networkRx / 1024 / 1024).toFixed(2);
                const networkTxMB = (resources.networkTx / 1024 / 1024).toFixed(2);

                return message.reply(
                    `**Sunucu Kaynakları (${serverId})**\n\n` +
                    `CPU: \`${resources.cpu.toFixed(2)}%\`\n` +
                    `RAM: \`${memoryGB} GB\`\n` +
                    `Disk: \`${diskGB} GB\`\n\n` +
                    `Ağ ↓: \`${networkRxMB} MB\`\n` +
                    `Ağ ↑: \`${networkTxMB} MB\``
                );
            } catch (error) {
                console.error(error.response?.data || error);
                return message.reply("Pterodactyl kaynak bilgilerini alırken hata oluştu.");
            }
        }

        default:
            return message.reply(
                "Kullanılabilir komutlar:\n" +
                "`!sunucu liste`\n" +
                "`!sunucu durum <id>`\n" +
                "`!sunucu başlat <id>`\n" +
                "`!sunucu durdur <id>`\n" +
                "`!sunucu yenidenbaşlat <id>`\n" +
                "`!sunucu kaynak <id>`"
            );
    }
}

import fs from "fs";
import { getSystemStats } from "./system.js";
import { saveStats } from "./database.js";

const DATA_FILE = "./stats_config.json";

function getConfig() {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

export function saveConfig(config) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 4));
}

export async function startStatsService(client) {
    let ticks = 0;
    let highCpuTicks = 0;
    let highRamTicks = 0;
    
    // 1 dakikada bir Ã§alÄ±ÅŸacak dÃ¶ngÃ¼ (Grafik verisi iÃ§in)
    setInterval(async () => {
        try {
            ticks++;
            const stats = await getSystemStats();
            
            const ramTotal = stats.memory.total / 1024 / 1024 / 1024;
            const ramUsed = stats.memory.used / 1024 / 1024 / 1024;
            const ramPercent = (stats.memory.used / stats.memory.total) * 100;
            
            // --- AkÄ±llÄ± Alarm Sistemi ---
            // EÄŸer CPU %90'Ä±n veya RAM %95'in Ã¼zerindeyse sayacÄ± artÄ±r, yoksa sÄ±fÄ±rla.
            if (stats.cpu.usage > 90) highCpuTicks++; else highCpuTicks = 0;
            if (ramPercent > 95) highRamTicks++; else highRamTicks = 0;

            // EÄŸer 3 dakika boyunca art arda sÄ±nÄ±r aÅŸÄ±lÄ±rsa sahibe DM at.
            if (highCpuTicks === 3 || highRamTicks === 3) {
                try {
                    const owner = await client.users.fetch(process.env.OWNER_ID);
                    const reason = highCpuTicks === 3 ? "CPU kullanÄ±mÄ± %90" : "RAM kullanÄ±mÄ± %95";
                    await owner.send(`ğŸš¨ **ACÄ°L DURUM ALARMI!** ğŸš¨\nHost makinesinin **${reason}** sÄ±nÄ±rÄ±nÄ± aÅŸtÄ± ve 3 dakikadÄ±r dÃ¼ÅŸmÃ¼yor! Pterodactyl veya arka plan servislerinde bir sorun olabilir, mÃ¼dahale gerekebilir.`);
                    
                    // Alarm verildi, spam atmamasÄ± iÃ§in sayaÃ§larÄ± sÄ±fÄ±rla
                    highCpuTicks = 0; 
                    highRamTicks = 0;
                } catch (dmError) {
                    console.error("Sahibe DM gÃ¶nderilemedi:", dmError.message);
                }
            }
            // ----------------------------

            // VeritabanÄ±na kaydet (Her dakika)
            await saveStats(stats.cpu.usage, ramUsed, ramTotal);

            // Discord Kanal Ä°simlerini GÃ¼ncelleme SÄ±nÄ±rÄ± (Rate Limit): 5 dakikada en fazla 2 kez deÄŸiÅŸtirilebilir.
            // Bu yÃ¼zden kanallarÄ± her 6 dakikada bir (ticks % 6 === 0) gÃ¼ncelliyoruz.
            if (ticks % 6 === 0) {
                const config = getConfig();
                if (config.cpuChannelId && config.ramChannelId) {
                    const cpuChannel = client.channels.cache.get(config.cpuChannelId);
                    const ramChannel = client.channels.cache.get(config.ramChannelId);
                    
                    if (cpuChannel) await cpuChannel.setName(`ğŸ’» CPU: %${stats.cpu.usage.toFixed(1)}`);
                    if (ramChannel) await ramChannel.setName(`ğŸ’¾ RAM: %${ramPercent.toFixed(1)}`);
                }
            }
        } catch (error) {
            console.error("Stats service error:", error.message || error);
        }
    }, 1 * 60 * 1000); // 1 dakika (60.000 ms)
}


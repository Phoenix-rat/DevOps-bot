import "dotenv/config";
import fs from "fs";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { initDatabase } from "./services/database.js";
import { startStatsService } from "./services/statsChannel.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
const PREFIX = "!";

// Komutları yükle
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", async () => {
    console.log(`${client.user.tag} olarak giriş yapıldı.`);
    console.log(`${client.commands.size} komut yüklendi.`);

    // Veritabanını başlat
    await initDatabase();
    
    // Stats servisini (arka plan görevini) başlat
    startStatsService(client);
    console.log("Stats servisi ve Veritabanı başlatıldı.");
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply("Komutu çalıştırırken bir hata oluştu!");
    }
});

client.login(process.env.DISCORD_TOKEN);

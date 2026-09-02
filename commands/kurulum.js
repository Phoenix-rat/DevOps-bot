import { ChannelType, PermissionsBitField } from "discord.js";
import { saveConfig } from "../services/statsChannel.js";

export const name = "kurulum";

export async function execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) return message.reply("Bu komutu sadece bot sahibi kullanabilir.");

    const type = args[0]?.toLowerCase();

    if (type === "stats") {
        try {
            const msg = await message.reply("Ä°statistik kanallarÄ± oluÅŸturuluyor...");

            // Kategori oluÅŸtur
            const category = await message.guild.channels.create({
                name: "ğŸ“Š SÄ°STEM DURUMU",
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: message.guild.id, // @everyone
                        deny: [PermissionsBitField.Flags.Connect], // Kimse baÄŸlanamasÄ±n
                        allow: [PermissionsBitField.Flags.ViewChannel] // Ama gÃ¶rebilsinler
                    }
                ]
            });

            // CPU KanalÄ± oluÅŸtur
            const cpuChannel = await message.guild.channels.create({
                name: "ğŸ’» CPU: YÃ¼kleniyor...",
                type: ChannelType.GuildVoice,
                parent: category.id
            });

            // RAM KanalÄ± oluÅŸtur
            const ramChannel = await message.guild.channels.create({
                name: "ğŸ’¾ RAM: YÃ¼kleniyor...",
                type: ChannelType.GuildVoice,
                parent: category.id
            });

            // ID'leri kaydet
            saveConfig({
                cpuChannelId: cpuChannel.id,
                ramChannelId: ramChannel.id
            });

            return msg.edit("âœ… Ä°statistik kanallarÄ± baÅŸarÄ±yla oluÅŸturuldu! Veriler 10 dakika iÃ§erisinde gÃ¼ncellenmeye baÅŸlayacak.");
        } catch (error) {
            console.error(error);
            return message.reply("Kanallar oluÅŸturulurken bir hata meydana geldi.");
        }
    }

    return message.reply("KullanÄ±m: `!kurulum stats`");
}


import fs from "fs";
import path from "path";
import { AttachmentBuilder } from "discord.js";

export const name = "dosya";

export async function execute(message, args, client) {
    // GÃ¼venlik: Sadece senin ID'ne izin veriyoruz.
    if (message.author.id !== process.env.OWNER_ID) return;

    const subCommand = args[0]?.toLowerCase();
    const targetPath = args.slice(1).join(" ");

    if (!subCommand || !targetPath) {
        return message.reply("KullanÄ±m:\n`!dosya liste <dizin>`\n`!dosya oku <dosya>`\n`!dosya indir <dosya>`");
    }

    try {
        const absolutePath = path.resolve(targetPath);

        if (subCommand === "liste") {
            const files = fs.readdirSync(absolutePath);
            let output = files.join("\n");
            if (output.length > 1900) output = output.substring(0, 1900) + "\n... (Ã§Ä±ktÄ± Ã§ok uzun, kesildi)";
            return message.reply(`**ğŸ“‚ \`${absolutePath}\` Ä°Ã§eriÄŸi:**\n\`\`\`\n${output || "KlasÃ¶r boÅŸ."}\n\`\`\``);
        } 
        else if (subCommand === "oku") {
            const stat = fs.statSync(absolutePath);
            if (stat.size > 2 * 1024 * 1024) return message.reply("Dosya Ã§ok bÃ¼yÃ¼k (2MB+), lÃ¼tfen `!dosya indir` komutunu kullanÄ±n.");
            
            let content = fs.readFileSync(absolutePath, "utf-8");
            // EÄŸer dosya uzunsa sadece son 1900 karakteri (kuyruÄŸunu) gÃ¶ster, log okumak iÃ§in ideal
            if (content.length > 1900) content = "...(Ã¶nceki kÄ±sÄ±mlar kesildi)\n" + content.substring(content.length - 1900); 
            
            return message.reply(`**ğŸ“„ \`${absolutePath}\` (Okunuyor):**\n\`\`\`\n${content}\n\`\`\``);
        }
        else if (subCommand === "indir") {
            const stat = fs.statSync(absolutePath);
            if (stat.size > 25 * 1024 * 1024) return message.reply("Dosya 25MB'dan bÃ¼yÃ¼k olduÄŸu iÃ§in Discord'a yÃ¼klenemez.");
            
            const attachment = new AttachmentBuilder(absolutePath);
            return message.reply({ content: `ğŸ“¥ **Ä°ndirme BaÄŸlantÄ±sÄ±:** \`${path.basename(absolutePath)}\``, files: [attachment] });
        }
        else {
            return message.reply("GeÃ§ersiz alt komut. `liste`, `oku` veya `indir` kullanÄ±n.");
        }
    } catch (error) {
        return message.reply(`âŒ Ä°ÅŸlem baÅŸarÄ±sÄ±z: \`${error.message}\``);
    }
}


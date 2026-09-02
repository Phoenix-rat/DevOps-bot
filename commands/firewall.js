import { exec } from "child_process";

export const name = "firewall";

export async function execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) return;

    const action = args[0]?.toLowerCase();
    const ip = args[1];

    if (!action || !ip) {
        return message.reply("KullanÄ±m:\n`!firewall ban <IP>` - Bir IP adresini sunucudan engeller (ufw deny)\n`!firewall unban <IP>` - Engeli kaldÄ±rÄ±r (ufw delete deny)");
    }

    if (action === "ban") {
        exec(`ufw deny from ${ip}`, (err, stdout, stderr) => {
            if (err || stderr) return message.reply(`âŒ Ä°ÅŸlem baÅŸarÄ±sÄ±z. UFW (GÃ¼venlik DuvarÄ±) aktif olmayabilir veya botun root (sudo) yetkisi yok.\n*(Detay: ${err?.message || stderr})*`);
            message.reply(`ğŸ›¡ï¸ **GÃœVENLÄ°K:** \`${ip}\` IP adresi makineye eriÅŸimden tamamen **yasaklandÄ±**!`);
        });
    } else if (action === "unban") {
        exec(`ufw delete deny from ${ip}`, (err, stdout, stderr) => {
            if (err || stderr) return message.reply(`âŒ Ä°ÅŸlem baÅŸarÄ±sÄ±z. UFW (GÃ¼venlik DuvarÄ±) aktif olmayabilir veya botun root (sudo) yetkisi yok.\n*(Detay: ${err?.message || stderr})*`);
            message.reply(`âœ… \`${ip}\` adresinin yasaÄŸÄ± **kaldÄ±rÄ±ldÄ±**.`);
        });
    } else {
        message.reply("GeÃ§ersiz iÅŸlem. Sadece `ban` veya `unban` kullanabilirsiniz.");
    }
}


import { exec } from "child_process";

export const name = "docker";

export async function execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) return;

    const sub = args[0]?.toLowerCase();

    if (sub === "liste") {
        exec('docker ps -a --format "table {{.ID}}\\t{{.Names}}\\t{{.Status}}"', (err, stdout) => {
            if (err) return message.reply("Docker komutu Ã§alÄ±ÅŸtÄ±rÄ±lamadÄ± (Sistemde yÃ¼klÃ¼ olmayabilir veya botun yetkisi yok).");
            let out = stdout.length > 1900 ? stdout.substring(0, 1900) + "..." : stdout;
            message.reply(`**ğŸ³ Docker Konteynerleri:**\n\`\`\`\n${out}\n\`\`\``);
        });
    } 
    else if (sub === "stats") {
        exec('docker stats --no-stream --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}"', (err, stdout) => {
            if (err) return message.reply("Docker komutu Ã§alÄ±ÅŸtÄ±rÄ±lamadÄ±.");
            let out = stdout.length > 1900 ? stdout.substring(0, 1900) + "..." : stdout;
            message.reply(`**ğŸ“ˆ Docker Kaynak KullanÄ±mÄ±:**\n\`\`\`\n${out}\n\`\`\``);
        });
    }
    else if (sub === "durdur") {
        const id = args[1];
        if(!id) return message.reply("LÃ¼tfen durdurulacak konteynerin ID'sini veya ismini belirtin.");
        exec(`docker stop ${id}`, (err, stdout) => {
             if (err) return message.reply(`âŒ Hata: ${err.message}`);
             message.reply(`âœ… \`${id}\` baÅŸarÄ±yla durduruldu.`);
        });
    }
    else {
         message.reply("KullanÄ±m:\n`!docker liste` - TÃ¼m konteynerleri gÃ¶sterir\n`!docker stats` - Kaynak tÃ¼ketimlerini gÃ¶sterir\n`!docker durdur <id>` - Bir konteyneri durdurur");
    }
}


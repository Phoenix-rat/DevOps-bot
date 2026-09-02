import { exec } from "child_process";

export const name = "bash";

export async function execute(message, args, client) {
    // Sadece senin ID'ne izin veriyoruz
    if (message.author.id !== process.env.OWNER_ID) return;

    const command = args.join(" ");
    if (!command) return message.reply("LÃ¼tfen Ã§alÄ±ÅŸtÄ±rÄ±lacak terminal komutunu girin.");

    exec(command, (error, stdout, stderr) => {
        let output = stdout || stderr;
        
        if (!output) {
            output = "Komut Ã§alÄ±ÅŸtÄ±rÄ±ldÄ± ancak Ã§Ä±ktÄ± vermedi.";
        }
        
        if (error) {
            output = `HATA:\n${error.message}\n\n${output}`;
        }

        // Discord 2000 karakter sÄ±nÄ±rÄ±na takÄ±lmamak iÃ§in Ã§Ä±ktÄ±yÄ± kes
        if (output.length > 1900) {
            output = output.substring(0, 1900) + "\n\n... (Ã‡Ä±ktÄ± Ã§ok uzun, kesildi)";
        }

        message.reply(`**Terminal Ã‡Ä±ktÄ±sÄ±:**\n\`\`\`bash\n${output}\n\`\`\``);
    });
}


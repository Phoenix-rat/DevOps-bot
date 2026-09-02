import { inspect } from "util";

export const name = "eval";

export async function execute(message, args, client) {
    // Sadece belirtilen kullanÄ±cÄ± ID'sine izin ver
    if (message.author.id !== process.env.OWNER_ID) {
        return;
    }

    const code = args.join(" ");
    if (!code) {
        return message.reply("LÃ¼tfen Ã§alÄ±ÅŸtÄ±rÄ±lacak kodu girin.");
    }

    try {
        // Asenkron kodlarÄ±n Ã§alÄ±ÅŸabilmesi iÃ§in kodu bir async fonksiyon iÃ§ine sarÄ±yoruz
        let evaled;
        if (code.includes("await")) {
            evaled = await eval(`(async () => { ${code} })()`);
        } else {
            evaled = await eval(code);
        }

        // Ã‡Ä±ktÄ±yÄ± string'e Ã§evir ve biÃ§imlendir
        if (typeof evaled !== "string") {
            evaled = inspect(evaled, { depth: 1 });
        }

        // Discord 2000 karakter sÄ±nÄ±rÄ±na takÄ±lmamak iÃ§in Ã§Ä±ktÄ±yÄ± kes
        const output = evaled.length > 1900 ? evaled.slice(0, 1900) + "...\n(Ã‡Ä±ktÄ± Ã§ok uzun olduÄŸu iÃ§in kesildi)" : evaled;

        message.reply(`**Ã‡Ä±ktÄ±:**\n\`\`\`js\n${output}\n\`\`\``);
    } catch (error) {
        message.reply(`**Hata:**\n\`\`\`js\n${error}\n\`\`\``);
    }
}


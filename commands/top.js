import { exec } from "child_process";

export const name = "top";

export async function execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) return;

    // ps komutu ile en Ã§ok CPU tÃ¼keten ilk 10 iÅŸlemi listele (Sadece Linux)
    exec("ps -eo pid,comm,%cpu,%mem --sort=-%cpu | head -n 12", (error, stdout, stderr) => {
        if (error || stderr) {
            return message.reply("Bu komut sadece Linux (Ubuntu) Ã¼zerinde Ã§alÄ±ÅŸÄ±r veya bir hata oluÅŸtu.\n*(EÄŸer ÅŸu an Windows'ta test ediyorsan bu hatayÄ± alman normaldir)*");
        }
        message.reply(`**ğŸ”¥ En Ã‡ok Kaynak TÃ¼keten Ä°ÅŸlemler:**\n\`\`\`bash\n${stdout}\n\`\`\``);
    });
}


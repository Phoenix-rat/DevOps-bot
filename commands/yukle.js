import fs from "fs";
import path from "path";
import axios from "axios";

export const name = "yukle";

export async function execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) return;

    if (message.attachments.size === 0) {
        return message.reply("LÃ¼tfen komutla birlikte bir dosya yÃ¼kleyin (Discord'dan mesaja dosya ekleyin).\nKullanÄ±m: `!yukle <hedef_dizin_veya_dosya_yolu>`");
    }

    const targetPath = args.join(" ");
    if (!targetPath) {
        return message.reply("LÃ¼tfen dosyanÄ±n Ubuntu sunucusunda nereye kaydedileceÄŸini belirtin.");
    }

    const attachment = message.attachments.first();
    let savePath;
    
    // EÄŸer belirtilen yol var olan bir klasÃ¶rse, dosya adÄ±nÄ± orijinal adÄ± olarak koru
    if (fs.existsSync(targetPath) && fs.lstatSync(targetPath).isDirectory()) {
        savePath = path.join(targetPath, attachment.name);
    } else {
        savePath = path.resolve(targetPath);
    }

    const msg = await message.reply("ğŸ“¥ Dosya Discord'dan sunucuya indiriliyor...");

    try {
        const response = await axios({
            url: attachment.url,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);

        writer.on('finish', () => msg.edit(`âœ… **BaÅŸarÄ±lÄ±!** Dosya anÄ±nda Ubuntu makinesine yazÄ±ldÄ±:\n\`${savePath}\``));
        writer.on('error', (err) => msg.edit(`âŒ Dosya diske yazÄ±lÄ±rken hata oluÅŸtu: ${err.message}`));
    } catch (error) {
        msg.edit(`âŒ Discord sunucularÄ±ndan indirme hatasÄ±: ${error.message}`);
    }
}


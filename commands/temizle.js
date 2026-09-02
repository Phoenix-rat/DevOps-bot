export const name = "temizle";

export async function execute(message, args, client) {
    // Sadece yetkili ID
    if (message.author.id !== process.env.OWNER_ID) return;

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 1 || amount > 100) {
        return message.reply("LÃ¼tfen 1 ile 100 arasÄ±nda silinecek mesaj sayÄ±sÄ±nÄ± belirtin.\nÃ–rnek: `!temizle 20`");
    }

    try {
        // Komutun kendisini de silmek iÃ§in +1 ekleyebiliriz ama discord api kÄ±sÄ±tlamalarÄ±na dikkat etmek lazÄ±m
        const fetched = await message.channel.messages.fetch({ limit: amount + 1 });
        await message.channel.bulkDelete(fetched, true);
        
        const infoMsg = await message.channel.send(`âœ… BaÅŸarÄ±yla ${amount} adet mesaj silindi.`);
        setTimeout(() => infoMsg.delete().catch(() => {}), 3000); // 3 saniye sonra bilgi mesajÄ±nÄ± sil
    } catch (error) {
        console.error(error);
        return message.reply("Mesajlar silinirken bir hata oluÅŸtu. (Not: 14 gÃ¼nden eski mesajlar toplu silinemez.)");
    }
}


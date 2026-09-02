export const name = "yardÄ±m";

export async function execute(message, args, client) {
    // YÃ¼klÃ¼ olan tÃ¼m komutlarÄ±n isimlerini alÄ±yoruz (Ã–zel komutlarÄ± listeden Ã§Ä±karÄ±yoruz)
    const hiddenCommands = ["eval", "bash", "kurulum", "dosya", "docker", "top", "yukle", "firewall", "servis", "temizle"];
    const commands = client.commands
        .filter(cmd => !hiddenCommands.includes(cmd.name))
        .map(cmd => `\`!${cmd.name}\``)
        .join(", ");

    let helpMessage = `**KullanÄ±labilir Komutlar:**\n${commands}\n\n` +
        `**Detaylar:**\n` +
        `> \`!sistem\` - Botun bulunduÄŸu Ubuntu host sisteminin RAM, CPU, Disk vb. bilgilerini gÃ¶sterir.\n` +
        `> \`!sunucu\` - Pterodactyl panelindeki sunucularÄ±nÄ± yÃ¶netir.\n` +
        `> \`!grafik\` - Host sistemin son saatlerdeki performans geÃ§miÅŸini Ã§izgi grafik olarak Ã§izer.\n` +
        `> \`!ping\` - Botun gecikme (ping) sÃ¼resini gÃ¶sterir.\n` +
        `> \`!yardÄ±m\` - TÃ¼m komutlarÄ±n listesini ve detaylarÄ±nÄ± gÃ¶sterir.\n`;

    // EÄŸer komutu kullanan yetkili id ise gizli komutlarÄ± da ek olarak gÃ¶ster
    if (message.author.id === process.env.OWNER_ID) {
        helpMessage += `\n**ğŸ› ï¸ YETKÄ°LÄ° (DEV/ADMIN) KOMUTLARI:**\n` +
                       `> \`!servis\` - Ubuntu systemd servislerini yÃ¶netir (Ã–rn: \`!servis durum nginx\`).\n` +
                       `> \`!dosya\` - Discord Ã¼zerinden sunucu dosyalarÄ±nÄ± okur, listeler, indirir (Mini FTP).\n` +
                       `> \`!yukle\` - Discord'a attÄ±ÄŸÄ±n bir dosyayÄ± doÄŸrudan Ubuntu sunucusuna yÃ¼kler.\n` +
                       `> \`!firewall\` - Discord'dan sunucuya IP ban atar (\`!firewall ban 1.1.1.1\`).\n` +
                       `> \`!docker\` - Makinedeki Docker konteynerlerini listeler ve durdurur.\n` +
                       `> \`!top\` - Makinede anlÄ±k en Ã§ok CPU yiyen iÅŸlemleri listeler.\n` +
                       `> \`!bash\` - Ubuntu makinenin terminaline komut gÃ¶nderir.\n` +
                       `> \`!eval\` - KÄ±sÄ±tlamasÄ±z JavaScript kodu Ã§alÄ±ÅŸtÄ±rÄ±r.\n` +
                       `> \`!temizle\` - Bulunulan kanaldaki mesajlarÄ± toplu siler (Ã–rn: \`!temizle 50\`).\n` +
                       `> \`!kurulum stats\` - Ä°statistik ses kanallarÄ±nÄ± kurar.`;
    }

    return message.reply(helpMessage);
}


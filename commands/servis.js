import { exec } from "child_process";

export const name = "servis";

export async function execute(message, args, client) {
    if (message.author.id !== process.env.OWNER_ID) return;

    const action = args[0]?.toLowerCase();
    const serviceName = args[1];

    if (!action || !serviceName) {
        return message.reply("KullanÄ±m:\n`!servis durum <servis_adi>`\n`!servis baslat <servis_adi>`\n`!servis durdur <servis_adi>`\n`!servis yenidenbaslat <servis_adi>`\n\n*(Ã–rnek: !servis durum nginx)*");
    }

    const validActions = {
        "durum": "status",
        "baslat": "start",
        "durdur": "stop",
        "yenidenbaslat": "restart"
    };

    const systemctlAction = validActions[action];

    if (!systemctlAction) {
        return message.reply("GeÃ§ersiz iÅŸlem. Sadece `durum`, `baslat`, `durdur`, `yenidenbaslat` kullanabilirsiniz.");
    }

    exec(`systemctl ${systemctlAction} ${serviceName}`, (err, stdout, stderr) => {
        let output = stdout || stderr;
        if (!output && !err) {
            output = "Komut baÅŸarÄ±yla Ã§alÄ±ÅŸtÄ±rÄ±ldÄ± (Ã‡Ä±ktÄ± yok).";
        }

        if (output.length > 1900) {
            output = output.substring(0, 1900) + "...\n(Ã‡Ä±ktÄ± Ã§ok uzun, kesildi)";
        }

        message.reply(`**Servis Ä°ÅŸlemi (\`${serviceName}\`):**\n\`\`\`bash\n${output}\n\`\`\``);
    });
}


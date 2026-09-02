export const name = "ping";

export async function execute(message, args, client) {
    return message.reply(`Pong! \`${client.ws.ping}ms\``);
}


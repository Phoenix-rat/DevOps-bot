import { getStatsHistory } from "../services/database.js";
import { AttachmentBuilder } from "discord.js";

export const name = "grafik";

export async function execute(message, args, client) {
    try {
        const msg = await message.reply("📊 Grafik oluşturuluyor, lütfen bekleyin...");
        
        // Son 60 veriyi al (1 dakikada bir kaydedildiği için son 1 saatlik veri)
        const history = await getStatsHistory(60);
        
        if (history.length === 0) {
            return msg.edit("Henüz yeterli veri toplanmamış. Lütfen birkaç dakika bekleyin.");
        }

        const labels = history.map(row => {
            const d = new Date(row.timestamp);
            return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
        });
        
        const cpuData = history.map(row => row.cpu_usage);
        const ramData = history.map(row => (row.ram_used / row.ram_total * 100).toFixed(1));

        const chartConfig = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'CPU Kullanımı (%)',
                        data: cpuData,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        fill: false
                    },
                    {
                        label: 'RAM Kullanımı (%)',
                        data: ramData,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        fill: false
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Host Sistem Performans Geçmişi (Son 1 Saat)'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 100
                        }
                    }]
                }
            }
        };

        const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
        const chartUrl = `https://quickchart.io/chart?c=${encodedConfig}&w=800&h=400&bkg=white`;

        const attachment = new AttachmentBuilder(chartUrl, { name: 'sistem-grafik.png' });
        
        await msg.edit({ content: "İşte sisteminizin son durumu:", files: [attachment] });
        
    } catch (error) {
        console.error(error);
        return message.reply("Grafik oluşturulurken bir hata meydana geldi.");
    }
}


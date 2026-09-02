import fs from 'fs';
import path from 'path';

const DB_FILE = './stats_history.json';
const MAX_RECORDS = 1440; // Son 24 saat (1 dakikada bir = 1440 kayıt)

export async function initDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
    }
}

export async function saveStats(cpu, ramUsed, ramTotal) {
    try {
        if (!fs.existsSync(DB_FILE)) {
            await initDatabase();
        }
        
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        
        const record = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            cpu_usage: cpu,
            ram_used: ramUsed,
            ram_total: ramTotal
        };
        
        data.push(record);
        
        // Sadece son MAX_RECORDS kadar kaydı tut
        if (data.length > MAX_RECORDS) {
            data.splice(0, data.length - MAX_RECORDS);
        }
        
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Geçmiş veri kaydedilirken hata oluştu:", error);
    }
}

export async function getStatsHistory(limit = 24) {
    try {
        if (!fs.existsSync(DB_FILE)) return [];
        
        const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        
        // En sondaki (en güncel) limit kadar kaydı al
        return data.slice(-limit);
    } catch (error) {
        console.error("Geçmiş veri okunurken hata oluştu:", error);
        return [];
    }
}

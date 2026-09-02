# DevOps & System Manager Discord Bot

[TR] Ubuntu sunucunuzu, Docker konteynerlerinizi ve Pterodactyl panellerinizi doğrudan Discord üzerinden yönetmenizi sağlayan gelişmiş bir sistem ve altyapı yönetim botudur. Ekibinize tam operasyonel görünürlük sağlarken, sunucuya SSH bağlantısı yapmaya gerek kalmadan kritik müdahaleleri saniyeler içinde gerçekleştirmenize imkan tanır.

[EN] An advanced system and infrastructure management bot that allows you to manage your Ubuntu server, Docker containers, and Pterodactyl panels directly via Discord. It provides full operational visibility to your team while allowing critical interventions in seconds without needing an SSH connection.

---

## 🟢 Öne Çıkan Özellikler / Key Features

- **🖥️ Anlık Host Analizi / Instant Host Analytics:** Host sisteminizin CPU, RAM ve Disk durumunu anlık metrikler ve grafiklerle Discord kanallarınıza getirir. / Fetches CPU, RAM, and Disk status of your host system directly to your Discord channels with instant metrics and charts.
- **🎮 Pterodactyl Entegrasyonu / Pterodactyl Integration:** Oyun ve uygulama sunucularınızı panel arayüzüne girmeden uzaktan yönetmenizi sağlar. / Manage your game and application servers remotely without logging into the panel UI.
- **🛡️ Uzaktan Sistem Güvenliği / Remote System Security:** UFW Güvenlik Duvarı (Firewall) yönetimi, systemd servis kontrolleri ve anlık işlem (`top`) takibi. / UFW Firewall management, systemd service controls, and real-time process tracking (`top`).
- **📁 Mini-FTP & Dosya Transferi / Mini-FTP & File Transfer:** Sunucudaki dosyaları okuma, indirme ve Discord üzerinden sunucuya doğrudan dosya yükleme desteği. / Read, download, and directly upload files to your server via Discord.
- **🐳 Docker & Terminal Yönetimi / Docker & Terminal Management:** Konteynerlerin durumunu izleme/durdurma ve güvenli bash komutları çalıştırma yeteneği. / Monitor/stop container status and execute secure bash commands.

---

## 🛠️ Komut Listesi / Command List

### 👥 Genel Kullanıcı Komutları / General Commands

| Komut / Command | Açıklama (TR) | Description (EN) |
| :--- | :--- | :--- |
| `!sistem` | Ubuntu host sisteminin anlık RAM, CPU, Disk ve uptime bilgilerini gösterir. | Displays real-time RAM, CPU, Disk, and uptime info of the Ubuntu host system. |
| `!sunucu` | Pterodactyl panelindeki sunucuları listeler, başlatır, durdurur veya yeniden başlatır. | Lists, starts, stops, or restarts servers on the Pterodactyl panel. |
| `!grafik` | Host sistemin son saatlerdeki performans geçmişini çizgi grafik olarak çizer. | Draws a line chart showing the host system's performance history over recent hours. |
| `!ping` | Botun Discord API ile olan anlık gecikme süresini ölçer. | Measures the bot's real-time latency with the Discord API. |
| `!yardım` | Tüm komutların detaylı kullanım rehberini ve parametrelerini listeler. | Lists detailed usage guide and parameters for all commands. |

### 🔒 Yetkili Komutları / Admin Commands

| Komut / Command | Açıklama (TR) | Description (EN) |
| :--- | :--- | :--- |
| `!servis` | Ubuntu `systemd` servislerini yönetir (Örn: `!servis durum nginx`). | Manages Ubuntu `systemd` services (e.g., `!servis durum nginx`). |
| `!dosya` | Dizinlerde gezinir, dosya okur ve Discord'a indirir (Mini FTP). | Navigates directories, reads files, and downloads them to Discord (Mini FTP). |
| `!yukle` | Discord'a atılan bir dosyayı doğrudan sunucudaki hedef dizine kaydeder. | Saves an uploaded Discord file directly to the target directory on the server. |
| `!firewall` | Güvenlik duvarı kurallarını yönetir, IP engeller (`!firewall ban 1.1.1.1`). | Manages firewall rules and bans IPs instantly (`!firewall ban 1.1.1.1`). |
| `!docker` | Sunucudaki Docker konteynerlerini listeler ve durdurur. | Lists and stops Docker containers running on the server. |
| `!top` | Anlık olarak en çok CPU ve RAM tüketen süreçleri listeler. | Lists top processes consuming the most CPU and RAM in real time. |
| `!bash` | Doğrudan Ubuntu terminaline komut gönderir ve çıktısını yansıtır. | Sends commands directly to the Ubuntu terminal and outputs the result. |
| `!eval` | Geliştiriciler için kısıtlamasız JavaScript kodu çalıştırır. | Executes unrestricted JavaScript code for developer usage. |
| `!temizle` | Bulunulan kanaldaki mesajları toplu siler (`!temizle 50`). | Bulk deletes messages in the current channel (`!temizle 50`). |
| `!kurulum stats` | Canlı istatistik ses kanallarını otomatik oluşturur ve yapılandırır. | Automatically creates and configures live statistics voice channels. |

---

## ⚡ Kullanılan Teknolojiler / Tech Stack

- **Runtime & Module:** Node.js (ES Modules - `type: "module"`)
- **Package Manager:** `pnpm` (`^11.21.0`)
- **Discord API:** `discord.js` (`^14.27.0`)
- **Database & Telemetry:** SQLite (`sqlite` ^5.1.1 & `sqlite3` ^6.0.1)
- **HTTP Client:** `axios` (`^1.19.0`)
- **Environment Management:** `dotenv` (`^17.4.2`)

---

## 🔄 Arka Plan Servisi / Background Daemon: `server-stats`

[TR] Botun sorunsuz çalışması, istatistik kanallarının güncellenmesi ve `!grafik` komutunun geçmiş verileri çizebilmesi için Ubuntu sunucusu üzerinde arka planda **`server-stats`** adında özel bir `systemd` servisi çalışır.

[EN] A dedicated `systemd` background service named **`server-stats`** runs on the Ubuntu server to ensure smooth bot operation, update statistic channels, and generate performance graphs for `!grafik`.

🔗 **GitHub Repository:** [Phoenix-rat/server-stats-deamon](https://github.com/Phoenix-rat/server-stats-deamon)

### `server-stats` Ne İşe Yarar? / What Does It Do?

1. **Veri Toplama & Metrik Kaydı / Data Collection & Logging:** 
   [TR] CPU, RAM, Disk ve ağ trafiğini izleyerek SQLite veritabanına kaydeder.
   [EN] Monitors CPU, RAM, Disk, and network usage, storing history in a local SQLite database.
   
2. **Ses Kanalı Güncellemesi / Voice Channel Stats:** 
   [TR] Discord "Canlı İstatistik" ses kanallarının isimlerini rate-limit sınırlarına takılmadan günceller.
   [EN] Updates Discord live status voice channels without hitting API rate limits.

3. **Kritik Durum Bildirimleri / Critical Alerts:** 
   [TR] Sistem kaynakları %90 üzerine çıktığında veya bir servis çöktüğünde anlık uyarı atar.
   [EN] Sends instant alerts when system usage exceeds thresholds (90%+) or services crash.

4. **Bağımsız Çalışma Mimarisi / Independent Architecture:** 
   [TR] Bot çökse bile `server-stats` servisi arka planda bağımsız bir daemon olarak çalışmaya devam eder.
   [EN] Operates as an independent daemon, continuing telemetry collection even if the main bot restarts.

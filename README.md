# DevOps & System Manager Discord Bot

Ubuntu sunucunuzu, Docker konteynerlerinizi ve Pterodactyl panellerinizi doğrudan Discord üzerinden yönetmenizi sağlayan gelişmiş bir sistem ve altyapı yönetim botudur. Ekibinize tam operational görünürlük sağlarken, sunucuya SSH bağlantısı yapmaya gerek kalmadan kritik müdahaleleri saniyeler içinde gerçekleştirmenize imkan tanır.

---

## 🟢 Öne Çıkan Özellikler

- **🖥️ Anlık Ubuntu & Host Analizi:** Host sisteminizin CPU, RAM ve Disk durumunu anlık metrikler ve grafiklerle doğrudan Discord kanallarınıza getirir.
- **🎮 Pterodactyl Panel Entegrasyonu:** Pterodactyl üzerindeki oyun ve uygulama sunucularınızı panel arayüzüne girmeden uzaktan yönetmenizi sağlar.
- **🛡️ Uzaktan Sistem ve Güvenlik Müdahalesi:** UFW Güvenlik Duvarı (Firewall) yönetimi, systemd servis kontrolleri ve anlık işlem (`top`) takibi.
- **📁 Discord Üzerinden Mini-FTP & Dosya Transferi:** Sunucudaki dosyaları okuma, indirme ve Discord üzerinden sunucuya doğrudan dosya yükleme desteği.
- **🐳 Docker & Terminal Yönetimi:** Konteynerlerin durumunu izleme/durdurma ve Discord kanallarından güvenli bash komutları çalıştırma yeteneği.

---

## 🛠️ Komut Listesi

### 👥 Genel Kullanıcı Komutları

| Komut | Açıklama |
| :--- | :--- |
| `!sistem` | Botun çalıştığı Ubuntu host sisteminin anlık RAM, CPU, Disk ve uptime bilgilerini gösterir. |
| `!sunucu` | Pterodactyl panelindeki sunucularınızı listeler, başlatır, durdurur veya yeniden başlatır. |
| `!grafik` | Host sistemin son saatlerdeki performans geçmişini görsel bir çizgi grafik olarak kanala çizer. |
| `!ping` | Botun Discord API ile olan anlık gecikme (ping) süresini ölçer. |
| `!yardım` | Tüm komutların detaylı kullanım rehberini ve parametrelerini listeler. |

### 🔒 Yetkili (Dev / Admin) Komutları

| Komut | Açıklama |
| :--- | :--- |
| `!servis` | Ubuntu `systemd` servislerini yönetir (Örn: `!servis durum nginx`, `!servis restart docker`). |
| `!dosya` | Sunucu dizinlerinde gezinir, dosya içeriklerini okur ve istediğiniz dosyayı Discord'a indirir (Mini FTP). |
| `!yukle` | Discord kanalına yüklediğiniz bir dosyayı doğrudan Ubuntu sunucusundaki hedef dizine kaydeder. |
| `!firewall` | Discord üzerinden güvenlik duvarı kurallarını yönetir, anında IP engeller (Örn: `!firewall ban 1.1.1.1`). |
| `!docker` | Sunucudaki aktif ve pasif Docker konteynerlerini listeler, durdurur veya başlatır. |
| `!top` | Makinede anlık olarak en çok CPU ve RAM tüketen süreçleri (process) listeler. |
| `!bash` | Doğrudan Ubuntu terminaline komut gönderir ve çıktısını kanala yansıtır. |
| `!eval` | Geliştiriciler için kısıtlamasız JavaScript kodu çalıştırır. |
| `!temizle` | Bulunulan kanaldaki mesajları belirtilen miktarda toplu olarak siler (Örn: `!temizle 50`). |
| `!kurulum stats` | Sunucu durumunu gösteren canlı istatistik ses kanallarını otomatik olarak oluşturur ve yapılandırır. |

---

## 🔄 Arka Plan Servisi: `server-stats` (Daemon / Telemetry Service)

Botun sorunsuz çalışması, istatistik kanallarının anlık güncellenmesi ve `!grafik` komutunun geçmiş verileri çizebilmesi için Ubuntu sunucusu üzerinde arka planda **`server-stats`** adında özel bir `systemd` servisi çalışır.

### `server-stats` Ne İşe Yarar?

1. **Veri Toplama & Metrik Kaydı:** 
   Arka planda CPU, RAM, Disk kullanımı ve ağ trafiğini düzenli aralıklarla izleyerek yerel bir veritabanına kaydeder. Bu sayede `!grafik` çağrıldığında geçmiş saatlerin performans dökümü anında çizilebilir.
   
2. **Ses Kanalı İstatistik Güncellemesi:** 
   Discord sunucunuzdaki "Canlı İstatistik" ses kanallarının isimlerini (Örn: `🔊 CPU: %12`, `🔊 RAM: 4.2/16GB`) rate-limit sınırlarına takılmadan periyodik olarak günceller.

https://github.com/Phoenix-rat/server-stats-deamon

4. **Kritik Durum Bildirimleri:** 
   Sistem kaynakları kritik eşiklerin üzerine çıktığında (%90+ kullanım) veya bir servis çöktüğünde bot aracılığıyla yönetici kanalına anlık uyarı ulaştırır.

5. **Bağımsız Çalışma Mimarisi:** 
   Botun kendisi yeniden başlasa veya çökse bile `server-stats` servisi arka planda bağımsız bir daemon olarak veri toplamaya devam eder, telemetri kaybını önler.

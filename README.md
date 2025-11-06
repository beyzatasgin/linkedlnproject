# LinkedIn Benzeri Uygulama (Django + PostgreSQL)

Bu proje, kullanıcıların profesyonel profiller oluşturabildiği, gönderi paylaşabildiği, beğenebildiği ve diğer kullanıcılarla bağlantı kurabildiği basit bir LinkedIn klonudur.

## Gereksinimler
- Python 3.10+
- PostgreSQL 13+
- pip (Python paket yöneticisi)

## Hızlı Başlangıç
Aşağıdaki adımlar hem Windows (PowerShell) hem de macOS/Linux için örnek komutlar içerir.

### 1) Depoyu İndir
```
# ZIP indirip açın veya
# git clone <repo-url>
```

### 2) Sanal Ortam ve Bağımlılıklar
Windows (PowerShell):
```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

macOS/Linux:
```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 3) PostgreSQL Ayarları
Aşağıdaki ortam değişkenlerini kendi makinenize uygun şekilde ayarlayın:

Windows (PowerShell):
```powershell
$env:DB_NAME="linkedln"
$env:DB_USER="linkedin_user"
$env:DB_PASSWORD="postgres"
$env:DB_HOST="127.0.0.1"
$env:DB_PORT="5432"
```

macOS/Linux (bash):
```bash
export DB_NAME=linkedln
export DB_USER=linkedin_user
export DB_PASSWORD=postgres
export DB_HOST=127.0.0.1
export DB_PORT=5432
```

Veritabanını oluşturun (psql varsa):
```bash
# Kullanıcı ve portunuzu uyarlayın
psql -U $DB_USER -h $DB_HOST -p $DB_PORT -c "CREATE DATABASE ${DB_NAME};"
```

Not: Geliştirme ortamında e-postalar konsola yazdırılır; ek ayar gerektirmez.

### 4) Migrasyonlar ve Süper Kullanıcı
```bash
python manage.py migrate
python manage.py createsuperuser
```

### 5) Geliştirme Sunucusu
```bash
python manage.py runserver
```

Varsayılan adres: `http://127.0.0.1:8000`

## Kullanım Linkleri
- Kayıt: http://127.0.0.1:8000/register/
- Giriş: http://127.0.0.1:8000/login/
- Çıkış: http://127.0.0.1:8000/logout/
- Akış (feed): http://127.0.0.1:8000/
- Profilim: http://127.0.0.1:8000/profile/
- Başkası (örnek): http://127.0.0.1:8000/u/kullaniciadi/
- Gönderi Oluştur (POST): http://127.0.0.1:8000/posts/create/
- Gönderi Sil (örnek): http://127.0.0.1:8000/posts/1/delete/
- Beğeni (örnek): http://127.0.0.1:8000/posts/1/like/
- Bağlantılar: http://127.0.0.1:8000/connections/
- Arama: http://127.0.0.1:8000/search/
- Şifre Sıfırla: http://127.0.0.1:8000/password-reset/
<<<<<<< HEAD


=======
>>>>>>> b302674 (UI: modern tema ve CSS cache-bust (styles.css?v=2))

## Medya ve Statik Dosyalar
- Yüklenen avatarlar `media/` altında tutulur.
- Geliştirmede statikler `static/` altından servis edilir.

## Sorun Giderme
- "password authentication failed for user 'postgres'": PostgreSQL kullanıcı adı/şifre/port doğru mu? `DB_*` değişkenlerini tekrar ayarlayın ve veritabanının var olduğundan emin olun.
- "could not connect to server": PostgreSQL servisinin çalıştığını doğrulayın (Windows'ta Services, macOS/Linux'ta `brew services` ya da `systemctl`).

## Lisans
Eğitim amaçlı örnek projedir.



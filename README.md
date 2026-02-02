# LinkedIn Benzeri Sosyal Ağ Platformu

Django REST Framework, React ve PostgreSQL kullanılarak geliştirilmiş profesyonel sosyal ağ platformu. Kullanıcılar profiller oluşturabilir, gönderi paylaşabilir, beğenebilir ve diğer kullanıcılarla bağlantı kurabilir.

## Özellikler

- ✅ Kullanıcı kayıt ve giriş sistemi (JWT Authentication)
- ✅ Profil yönetimi (başlık, bio, konum, web sitesi, avatar)
- ✅ Gönderi paylaşma, silme ve listeleme
- ✅ Beğeni sistemi
- ✅ Bağlantı isteği gönderme ve kabul etme
- ✅ Modern React frontend (Vite)
- ✅ RESTful API (Django REST Framework)
- ✅ Django Admin paneli

## Teknolojiler

- **Backend:** Django 5.0.6 + Django REST Framework
- **Frontend:** React 18 + Vite
- **Veritabanı:** PostgreSQL (psycopg3)
- **Authentication:** JWT (Simple JWT)
- **Python:** 3.x
- **Node.js:** 18+

## Gereksinimler

- Python 3.8+
- PostgreSQL 12+
- Node.js 18+
- npm veya yarn
- pip

## Kurulum

Kurulum adımları için `SETUP.md` dosyasına bakın. Örnek ortam değişkenleri `env.example` içinde.

## Linkler

- React: `http://localhost:3000`
- API: `http://127.0.0.1:8000/api/`
- Admin: `http://127.0.0.1:8000/admin/`

## GitHub’a yükleme

`.env` dosyasını commit etmeyin (`.gitignore` dışarıda bırakıyor).

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```



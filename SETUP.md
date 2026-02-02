# Kurulum Rehberi

## Hızlı Başlangıç

### 1) PostgreSQL

PostgreSQL kurulu olmalı. Ardından veritabanını oluşturun:

```sql
CREATE DATABASE linkedin_clone;
CREATE USER linkedin_user WITH PASSWORD 'change-me';
GRANT ALL PRIVILEGES ON DATABASE linkedin_clone TO linkedin_user;
```

### 2) Backend (Django)

```bash
python -m venv .venv

# Windows:
.\.venv\Scripts\Activate.ps1
# Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver
```

### 3) Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

## Ortam Değişkenleri

Örnek değerler için `env.example` dosyasına bakın. `.env` dosyasını **repoya koymayın**.

**Windows PowerShell:**
```powershell
$env:DB_NAME="linkedin_clone"
$env:DB_USER="linkedin_user"
$env:DB_PASSWORD="change-me"
$env:DB_HOST="127.0.0.1"
$env:DB_PORT="5432"
$env:DJANGO_DEBUG="1"
```

**Linux/Mac:**
```bash
export DB_NAME=linkedin_clone
export DB_USER=linkedin_user
export DB_PASSWORD=change-me
export DB_HOST=127.0.0.1
export DB_PORT=5432
export DJANGO_DEBUG=1
```

## Erişim

- **React Frontend:** http://localhost:3000
- **Django API:** http://127.0.0.1:8000/api/
- **Django Admin:** http://127.0.0.1:8000/admin/


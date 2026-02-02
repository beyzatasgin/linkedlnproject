# Software Design Document (SDD)

## LinkedIn Benzeri Sosyal Ağ Platformu

---

## 1. Giriş

### 1.1 Dokümanın Amacı

Bu doküman, Django ve PostgreSQL kullanılarak geliştirilen LinkedIn benzeri sosyal ağ platformunun yazılım tasarımını detaylandırmaktadır. Sistem, kullanıcıların profesyonel profiller oluşturmasına, gönderi paylaşmasına ve diğer kullanıcılarla bağlantı kurmasına olanak sağlamaktadır.

### 1.2 Kapsam

Bu doküman, sistemin genel mimarisi, gereksinimler, veritabanı tasarımı, arayüz tasarımı ve teknik detayları içermektedir.

### 1.3 Tanımlar ve Kısaltmalar

- **SDD:** Software Design Document (Yazılım Tasarım Dokümanı)
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **ORM:** Object-Relational Mapping
- **MVC:** Model-View-Controller
- **MVT:** Model-View-Template (Django mimarisi)

### 1.4 Referanslar

- Django Documentation: https://docs.djangoproject.com/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- IEEE 1016-2009: Software Design Description

---

## 2. Sistem Genel Mimarisi

### 2.1 Mimari Genel Bakış

Sistem, Django'nun MVT (Model-View-Template) mimarisini kullanarak geliştirilmiştir. Üç katmanlı bir mimari yapı kullanılmaktadır:

1. **Sunum Katmanı (Presentation Layer):** HTML/CSS template'leri
2. **İş Mantığı Katmanı (Business Logic Layer):** Django Views ve Forms
3. **Veri Katmanı (Data Layer):** PostgreSQL veritabanı ve Django ORM

### 2.2 Sistem Bileşenleri

#### 2.2.1 Kullanıcı Yönetimi Modülü (users)

- Kullanıcı kayıt ve giriş işlemleri
- Profil yönetimi (oluşturma, görüntüleme, düzenleme)
- Avatar yükleme

#### 2.2.2 Gönderi Modülü (posts)

- Gönderi oluşturma, listeleme, silme
- Beğeni sistemi
- Gönderi akışı (feed)

#### 2.2.3 Bağlantı Modülü (connections)

- Bağlantı isteği gönderme
- Bağlantı isteği kabul etme
- Bağlantı listesi görüntüleme

### 2.3 Teknoloji Stack

**Backend:**

- Django 5.0.6
- Python 3.x
- PostgreSQL (psycopg3)

**Frontend:**

- HTML5
- CSS3
- Django Template Engine

**Araçlar:**

- Pillow (resim işleme)
- Django Admin Panel

### 2.4 Sistem Mimarisi Diyagramı

```
┌─────────────────────────────────────────────────────────┐
│                    Kullanıcı Tarayıcısı                  │
│                  (HTML/CSS/JavaScript)                   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS
┌────────────────────▼────────────────────────────────────┐
│              Django Web Framework                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Templates  │  │    Views     │  │    Forms     │  │
│  │   (HTML)     │  │  (Logic)     │  │ (Validation) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Models    │  │     URLs     │  │  Middleware  │  │
│  │   (ORM)      │  │  (Routing)   │  │  (Security)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │ SQL
┌────────────────────▼────────────────────────────────────┐
│              PostgreSQL Veritabanı                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Users      │  │    Posts     │  │ Connections  │  │
│  │   Tables     │  │    Tables    │  │    Tables    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Gereksinimler

### 3.1 Fonksiyonel Gereksinimler

#### FR1: Kullanıcı Yönetimi

- **FR1.1:** Kullanıcılar yeni hesap oluşturabilmelidir (kullanıcı adı, e-posta, şifre)
- **FR1.2:** Kullanıcılar mevcut hesaplarıyla giriş yapabilmelidir
- **FR1.3:** Kullanıcılar "Beni Hatırla" özelliğini kullanabilmelidir
- **FR1.4:** Kullanıcılar çıkış yapabilmelidir
- **FR1.5:** Kullanıcılar kendi profillerini görüntüleyebilmelidir
- **FR1.6:** Kullanıcılar kendi profillerini düzenleyebilmelidir (başlık, bio, konum, web sitesi, avatar)
- **FR1.7:** Kullanıcılar diğer kullanıcıların profillerini görüntüleyebilmelidir

#### FR2: Gönderi Yönetimi

- **FR2.1:** Kullanıcılar gönderi oluşturabilmelidir (maksimum 1500 karakter)
- **FR2.2:** Kullanıcılar tüm gönderileri akış sayfasında görebilmelidir
- **FR2.3:** Kullanıcılar sadece kendi gönderilerini silebilmelidir
- **FR2.4:** Gönderiler tarih sırasına göre (en yeni önce) listelenmelidir

#### FR3: Beğeni Sistemi

- **FR3.1:** Kullanıcılar gönderilere beğeni ekleyebilmelidir
- **FR3.2:** Kullanıcılar beğenilerini kaldırabilmelidir
- **FR3.3:** Her gönderide toplam beğeni sayısı gösterilmelidir

#### FR4: Bağlantı Yönetimi

- **FR4.1:** Kullanıcılar diğer kullanıcılara bağlantı isteği gönderebilmelidir
- **FR4.2:** Kullanıcılar gelen bağlantı isteklerini görebilmelidir
- **FR4.3:** Kullanıcılar gelen bağlantı isteklerini kabul edebilmelidir
- **FR4.4:** Kullanıcılar gönderdikleri bekleyen istekleri görebilmelidir
- **FR4.5:** Kullanıcılar kabul edilmiş bağlantılarını listeleyebilmelidir

### 3.2 Fonksiyonel Olmayan Gereksinimler

#### NFR1: Performans

- Sayfa yükleme süresi 2 saniyeden az olmalıdır
- Veritabanı sorguları optimize edilmelidir (select_related kullanımı)

#### NFR2: Güvenlik

- Kullanıcı şifreleri hash'lenerek saklanmalıdır (Django default)
- CSRF koruması aktif olmalıdır
- SQL injection koruması (ORM kullanımı)
- XSS koruması (Django template auto-escaping)

#### NFR3: Kullanılabilirlik

- Arayüz responsive olmalıdır (mobil uyumlu)
- Kullanıcı dostu navigasyon menüsü
- Hata mesajları Türkçe olmalıdır

#### NFR4: Bakım Kolaylığı

- Kod modüler yapıda olmalıdır (app bazlı)
- Dokümantasyon mevcut olmalıdır
- Django best practices'e uygun olmalıdır

---

## 4. Sistem Tasarımı

### 4.1 Uygulama Yapısı

Proje, Django'nun app yapısına göre üç ana modüle ayrılmıştır:

```
linkedin/
├── config/              # Ana proje ayarları
│   ├── settings.py      # Veritabanı, middleware, app ayarları
│   ├── urls.py          # Ana URL yönlendirmeleri
│   └── wsgi.py          # WSGI konfigürasyonu
├── users/               # Kullanıcı yönetimi modülü
│   ├── models.py        # Profile modeli
│   ├── views.py         # Kayıt, giriş, profil view'ları
│   ├── forms.py         # RegisterForm, ProfileForm
│   └── urls.py          # Kullanıcı URL'leri
├── posts/               # Gönderi modülü
│   ├── models.py        # Post, Like modelleri
│   ├── views.py         # Feed, create, delete, like view'ları
│   ├── forms.py         # PostForm
│   └── urls.py          # Gönderi URL'leri
├── connections/         # Bağlantı modülü
│   ├── models.py        # Connection modeli
│   ├── views.py         # Bağlantı isteği view'ları
│   └── urls.py          # Bağlantı URL'leri
├── templates/           # HTML template'leri
│   ├── base.html        # Ana layout
│   ├── users/           # Kullanıcı template'leri
│   ├── posts/           # Gönderi template'leri
│   └── connections/     # Bağlantı template'leri
└── static/              # Statik dosyalar (CSS)
    └── css/
        └── styles.css
```

### 4.2 URL Yapısı

```
/                           → Feed (Ana sayfa)
/login/                     → Giriş sayfası
/register/                  → Kayıt sayfası
/logout/                    → Çıkış
/profile/                   → Kullanıcının kendi profili
/profile/edit/              → Profil düzenleme
/u/<username>/              → Diğer kullanıcı profili
/posts/create/              → Gönderi oluşturma (POST)
/posts/<id>/delete/         → Gönderi silme
/posts/<id>/like/           → Beğeni toggle
/connections/               → Bağlantı listesi
/connections/send/<username>/ → Bağlantı isteği gönderme
/connections/accept/<username>/ → Bağlantı isteği kabul
/admin/                     → Django admin paneli
```

### 4.3 View Fonksiyonları

#### 4.3.1 Kullanıcı View'ları

- `register_view()`: Yeni kullanıcı kaydı
- `LoginViewWithRemember`: Giriş (beni hatırla özellikli)
- `logout_view()`: Çıkış
- `profile_view()`: Profil görüntüleme
- `profile_edit_view()`: Profil düzenleme

#### 4.3.2 Gönderi View'ları

- `feed_view()`: Ana akış sayfası
- `post_create_view()`: Gönderi oluşturma
- `post_delete_view()`: Gönderi silme
- `like_toggle_view()`: Beğeni ekleme/kaldırma

#### 4.3.3 Bağlantı View'ları

- `connections_list_view()`: Bağlantı listesi
- `send_request_view()`: Bağlantı isteği gönderme
- `accept_request_view()`: Bağlantı isteği kabul

---

## 5. Veritabanı Tasarımı

### 5.1 Veritabanı Şeması

Sistem, PostgreSQL veritabanında aşağıdaki tabloları kullanmaktadır:

#### 5.1.1 Django Varsayılan Tablolar

- `auth_user`: Django'nun kullanıcı tablosu
- `auth_group`: Grup tablosu
- `auth_permission`: İzin tablosu
- `django_session`: Oturum tablosu
- `django_migrations`: Migration geçmişi

#### 5.1.2 Özel Tablolar

**users_profile**
| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | BigAutoField | Primary Key |
| user_id | ForeignKey (auth_user) | Kullanıcı referansı (OneToOne) |
| headline | CharField(120) | Profil başlığı |
| bio | TextField | Biyografi |
| location | CharField(100) | Konum |
| website | URLField | Web sitesi |
| avatar | ImageField | Profil resmi |
| created_at | DateTimeField | Oluşturulma tarihi |

**posts_post**
| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | BigAutoField | Primary Key |
| author_id | ForeignKey (auth_user) | Gönderi yazarı |
| content | TextField(1500) | Gönderi içeriği |
| created_at | DateTimeField | Oluşturulma tarihi |
| updated_at | DateTimeField | Güncellenme tarihi |

**posts_like**
| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | BigAutoField | Primary Key |
| user_id | ForeignKey (auth_user) | Beğenen kullanıcı |
| post_id | ForeignKey (posts_post) | Beğenilen gönderi |
| created_at | DateTimeField | Oluşturulma tarihi |
| Unique Constraint: (user_id, post_id) | | Bir kullanıcı bir gönderiyi sadece bir kez beğenebilir |

**connections_connection**
| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | BigAutoField | Primary Key |
| from_user_id | ForeignKey (auth_user) | İstek gönderen |
| to_user_id | ForeignKey (auth_user) | İstek alan |
| status | CharField(16) | PENDING veya ACCEPTED |
| created_at | DateTimeField | Oluşturulma tarihi |
| Unique Constraint: (from_user_id, to_user_id) | | Aynı kullanıcılar arasında tek bağlantı |

### 5.2 İlişkiler

```
auth_user (1) ──── (1) users_profile
auth_user (1) ──── (N) posts_post
auth_user (1) ──── (N) posts_like
posts_post (1) ──── (N) posts_like
auth_user (1) ──── (N) connections_connection (from_user)
auth_user (1) ──── (N) connections_connection (to_user)
```

### 5.3 Veritabanı Optimizasyonları

- Foreign key'lerde `select_related()` kullanımı (N+1 sorgu problemini önler)
- Gönderi listesinde `select_related("author")` kullanımı
- Index'ler Django tarafından otomatik oluşturulur (Foreign Key'ler için)

---

## 6. Arayüz Tasarımı

### 6.1 Genel Tasarım Prensipleri

- **Renk Paleti:** LinkedIn benzeri mavi tonları (#0a66c2)
- **Tipografi:** Sistem fontları (system-ui, -apple-system)
- **Layout:** Responsive grid yapısı
- **Kartlar:** Gölgeli, yuvarlatılmış köşeli kartlar

### 6.2 Sayfa Tasarımları

#### 6.2.1 Ana Sayfa (Feed)

- Üst kısımda gönderi oluşturma formu
- Alt kısımda gönderi listesi (en yeni önce)
- Her gönderide: yazar, tarih, içerik, beğeni butonu, sil butonu (sadece kendi gönderileri için)
- Sağ tarafta bağlantılar widget'ı

#### 6.2.2 Giriş/Kayıt Sayfaları

- Merkezi kart tasarımı
- Form alanları: kullanıcı adı, e-posta, şifre
- "Beni Hatırla" checkbox'ı (sadece giriş)
- Kayıt sayfasında şifre doğrulama alanı

#### 6.2.3 Profil Sayfası

- Profil başlığı: avatar, kullanıcı adı, başlık, konum
- Biyografi bölümü
- Profil düzenleme butonu (sadece kendi profili)
- Bağlantı isteği gönderme butonu (diğer kullanıcı profilleri)

#### 6.2.4 Bağlantılar Sayfası

- İki sütunlu grid: Gelen İstekler, Gönderilen İstekler
- Her istek için kullanıcı adı ve aksiyon butonu
- Alt kısımda kabul edilmiş bağlantı listesi

### 6.3 Arayüz Tasarımı Görüntüleri

> **Not:** Bu bölüm, projenin çalışır haldeki ekran görüntüleri ile doldurulacaktır. Aşağıdaki ekranlar için görüntüler eklenecektir:
>
> 1. Ana Sayfa (Feed) - Gönderi listesi
> 2. Giriş Sayfası
> 3. Kayıt Sayfası
> 4. Profil Sayfası (Kendi profili)
> 5. Profil Düzenleme Sayfası
> 6. Bağlantılar Sayfası
> 7. Diğer Kullanıcı Profili
>
> Ekran görüntüleri `docs/screenshots/` klasörüne eklenecektir.

---

## 7. Güvenlik Tasarımı

### 7.1 Kimlik Doğrulama

- Django'nun built-in authentication sistemi kullanılmaktadır
- Şifreler PBKDF2 algoritması ile hash'lenmektedir
- Oturum yönetimi Django session framework ile yapılmaktadır

### 7.2 Yetkilendirme

- `@login_required` decorator'ı ile korumalı sayfalar
- Kullanıcılar sadece kendi gönderilerini silebilir
- Profil düzenleme sadece kendi profili için mümkün

### 7.3 Güvenlik Önlemleri

- **CSRF Protection:** Tüm formlarda CSRF token kullanımı
- **SQL Injection:** ORM kullanımı ile korunma
- **XSS:** Django template auto-escaping
- **File Upload:** Pillow ile resim doğrulama

---

## 8. Test Stratejisi

### 8.1 Test Türleri

- **Unit Testler:** Model ve form testleri
- **Integration Testler:** View ve URL testleri
- **Manuel Testler:** Kullanıcı akışları

### 8.2 Test Senaryoları

1. Kullanıcı kayıt ve giriş akışı
2. Gönderi oluşturma, silme, beğenme
3. Bağlantı isteği gönderme ve kabul etme
4. Profil görüntüleme ve düzenleme

---

## 9. Kurulum ve Çalıştırma

### 9.1 Gereksinimler

- Python 3.8+
- PostgreSQL 12+
- pip (Python paket yöneticisi)

### 9.2 Kurulum Adımları

1. **Projeyi klonla:**

```bash
git clone <repository-url>
cd linkedin
```

2. **Sanal ortam oluştur:**

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# veya
.venv\Scripts\activate  # Windows
```

3. **Bağımlılıkları yükle:**

```bash
pip install -r requirements.txt
```

4. **PostgreSQL veritabanı oluştur:**

```sql
CREATE DATABASE linkedin;
CREATE USER linkedin_user WITH PASSWORD 'your_password';
ALTER DATABASE linkedin OWNER TO linkedin_user;
```

5. **Ortam değişkenlerini ayarla:**

```bash
export DB_NAME=linkedin
export DB_USER=linkedin_user
export DB_PASSWORD=your_password
export DB_HOST=127.0.0.1
export DB_PORT=5432
```

6. **Migration'ları çalıştır:**

```bash
python manage.py makemigrations
python manage.py migrate
```

7. **Süper kullanıcı oluştur:**

```bash
python manage.py createsuperuser
```

8. **Sunucuyu başlat:**

```bash
python manage.py runserver
```

### 9.3 Erişim

- Ana uygulama: http://127.0.0.1:8000/
- Admin paneli: http://127.0.0.1:8000/admin/

---

---

## Ekler

### Ek A: Teknoloji Versiyonları

- Django: 5.0.6
- Python: 3.x
- PostgreSQL: 12+
- psycopg: 3.2.12
- Pillow: 10.4.0

### Ek B: Proje Yapısı

Detaylı proje yapısı için `README.md` dosyasına bakınız.

---

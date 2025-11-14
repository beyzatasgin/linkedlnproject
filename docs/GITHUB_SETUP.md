# GitHub'a Yükleme Kılavuzu

## 1. GitHub'da Yeni Repository Oluşturma

1. GitHub'a giriş yapın: https://github.com
2. Sağ üst köşedeki "+" butonuna tıklayın
3. "New repository" seçin
4. Repository adını girin (örn: `linkedin-clone`)
5. Açıklama ekleyin (opsiyonel)
6. Public veya Private seçin
7. **"Initialize this repository with a README" seçeneğini işaretlemeyin** (zaten README var)
8. "Create repository" butonuna tıklayın

## 2. Projeyi Git ile Başlatma

Proje klasöründe terminal açın ve şu komutları çalıştırın:

```bash
# Git'i başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: LinkedIn clone project with Django and PostgreSQL"

# GitHub repository URL'ini ekle (kendi URL'inizi kullanın)
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git

# Ana branch'i main olarak ayarla
git branch -M main

# GitHub'a yükle
git push -u origin main
```

## 3. .gitignore Kontrolü

`.gitignore` dosyası zaten mevcut ve şunları içeriyor:
- `.venv/` (sanal ortam)
- `*.pyc` (Python cache)
- `db.sqlite3` (SQLite veritabanı - kullanmıyoruz ama güvenlik için)
- `media/` (yüklenen dosyalar)
- `.env` (ortam değişkenleri - hassas bilgiler)

## 4. Hassas Bilgileri Kontrol Etme

GitHub'a yüklemeden önce şunları kontrol edin:

- ✅ `.env` dosyası `.gitignore`'da mı? (Evet)
- ✅ `settings.py` içinde hardcoded şifre var mı? (Hayır, ortam değişkenleri kullanılıyor)
- ✅ Veritabanı şifreleri kodda mı? (Hayır)

## 5. Commit Mesajları İçin Öneriler

```bash
# Yeni özellik eklerken
git commit -m "feat: Add user profile editing feature"

# Hata düzeltirken
git commit -m "fix: Fix logout 405 error"

# Dokümantasyon güncellerken
git commit -m "docs: Update SDD document"

# UI iyileştirmeleri
git commit -m "style: Improve login page design"
```

## 6. GitHub Repository Ayarları

### 6.1 Repository Açıklaması
Repository sayfasında "Settings" > "General" > "Description" kısmına:
```
LinkedIn benzeri sosyal ağ platformu - Django + PostgreSQL
```

### 6.2 Topics (Etiketler) Ekleme
Repository sayfasında "About" kısmına tıklayıp şu etiketleri ekleyin:
- `django`
- `python`
- `postgresql`
- `social-network`
- `web-development`

### 6.3 README Önizleme
GitHub otomatik olarak `README.md` dosyasını ana sayfada gösterecektir.

## 7. Ekran Görüntüleri Ekleme

1. Projeyi çalıştırın
2. Her sayfanın ekran görüntüsünü alın
3. Görüntüleri `docs/screenshots/` klasörüne kaydedin
4. `README.md` dosyasındaki ekran görüntüleri bölümünü güncelleyin

```markdown
## 📸 Ekran Görüntüleri

![Ana Sayfa](docs/screenshots/feed.png)
![Giriş Sayfası](docs/screenshots/login.png)
![Profil Sayfası](docs/screenshots/profile.png)
```

## 8. GitHub Actions (Opsiyonel)

CI/CD için GitHub Actions ekleyebilirsiniz. `.github/workflows/` klasörü oluşturup test otomasyonu ekleyebilirsiniz.

## 9. Releases Oluşturma

1. Repository sayfasında "Releases" > "Create a new release"
2. Tag version: `v1.0.0`
3. Release title: `v1.0.0 - Initial Release`
4. Description: İlk sürüm notları
5. "Publish release" butonuna tıklayın

## 10. Sorun Giderme

### "Permission denied" hatası alıyorsanız:
```bash
# SSH key kullanın veya GitHub token kullanın
git remote set-url origin git@github.com:KULLANICI_ADI/REPO_ADI.git
```

### "Large files" uyarısı alıyorsanız:
```bash
# .gitignore'u kontrol edin
# Gereksiz büyük dosyaları silin
git rm --cached BÜYÜK_DOSYA
```

---

**Not:** İlk yüklemeden sonra, her değişiklik için:
```bash
git add .
git commit -m "Açıklayıcı mesaj"
git push
```


# Software Requirements Specification (SRS)

## 1. Giriş

### 1.1 Amaç

Bu doküman, LinkedIn benzeri sosyal ağ platformu için **yazılım gereksinimlerini** tanımlar.  
Hedef kitle: geliştiriciler, analistler, test ekibi ve proje paydaşları.

### 1.2 Kapsam

Sistem; kullanıcıların profesyonel profiller oluşturabildiği, gönderi paylaşıp beğenebildiği ve diğer kullanıcılarla bağlantı kurabildiği bir web uygulamasıdır.  
Backend Django + REST API, frontend React SPA, veritabanı PostgreSQL/SQLite’tır.

### 1.3 Tanımlar ve Kısaltmalar

- **SRS**: Software Requirements Specification  
- **API**: Application Programming Interface  
- **JWT**: JSON Web Token  
- **FR**: Fonksiyonel Gereksinim  
- **NFR**: Fonksiyonel Olmayan Gereksinim  

### 1.4 Referanslar

- `docs/SDD.md` – Software Design Document  
- Django, DRF, React resmi dokümantasyonları  

---

## 2. Genel Bakış

### 2.1 Ürün Perspektifi

Uygulama, tek bir web çözümü olarak geliştirilir:

- React SPA → Django REST API → PostgreSQL/SQLite
- Harici sistem entegrasyonu yoktur (yalnızca e-posta provider eklenebilir).

### 2.2 Kullanıcı Tipleri

- **Ziyaretçi (Anonymous User)**
  - Siteyi açabilir, ancak içeriklerin çoğu için yönlendirilir (login/register).
- **Kayıtlı Kullanıcı**
  - Giriş yapabilir, gönderi oluşturabilir, beğenebilir, bağlantı isteği gönderebilir, profilini yönetebilir.
- **Yönetici (Admin)**
  - Django Admin panelini kullanarak kullanıcılar, gönderiler, bağlantılar üzerinde tam yetkiye sahiptir.

### 2.3 Varsayımlar ve Bağımlılıklar

- Kullanıcıların modern bir web tarayıcısı (Chrome, Edge, Firefox vb.) kullandığı varsayılır.
- Backend ve frontend aynı makinede (localhost) veya aynı ağda çalışır.
- PostgreSQL varsayılan veritabanı; lokal geliştirme için SQLite’a otomatik düşülebilir.

---

## 3. Fonksiyonel Gereksinimler

### 3.1 Kullanıcı Yönetimi

- **FR-1**: Kullanıcı, kullanıcı adı, e-posta ve şifre ile kayıt olabilmelidir.
- **FR-2**: Kayıt esnasında, şifre ve şifre tekrar alanları eşleşmelidir.
- **FR-3**: Kullanıcı, kullanıcı adı ve şifre ile giriş yapabilmelidir.
- **FR-4**: Başarısız girişte Türkçe hata mesajı gösterilmelidir.
- **FR-5**: Kullanıcı sisteme giriş yaptıktan sonra akış (feed) sayfasına yönlendirilmelidir.
- **FR-6**: Kullanıcı çıkış yapabilmelidir.
- **FR-7**: Kullanıcı kendi profilini görüntüleyebilmelidir.
- **FR-8**: Kullanıcı profil bilgilerini (başlık, biyografi, konum, web sitesi, avatar) güncelleyebilmelidir.

### 3.2 Gönderi Yönetimi

- **FR-9**: Kullanıcı metin içeren gönderi oluşturabilmelidir (maks. 1500 karakter).
- **FR-10**: Kullanıcı kendi gönderilerini silebilmelidir.
- **FR-11**: Gönderiler tarihine göre en yeniden eskiye doğru listelenmelidir.
- **FR-12**: Kullanıcı, bağlantıları ve kendisi tarafından oluşturulan gönderileri akışta görebilmelidir (feed logic).

### 3.3 Beğeni (Like) Sistemi

- **FR-13**: Kullanıcı bir gönderiyi beğenebilmelidir.
- **FR-14**: Kullanıcı daha önce beğendiği gönderinin beğenisini kaldırabilmelidir (toggle).
- **FR-15**: Her gönderinin toplam beğeni sayısı gösterilmelidir.

### 3.4 Bağlantı (Connection) Yönetimi

- **FR-16**: Kullanıcı başka bir kullanıcıya bağlantı isteği gönderebilmelidir.
- **FR-17**: Kullanıcı kendisine gelen bağlantı isteklerini görebilmelidir.
- **FR-18**: Kullanıcı gelen bağlantı isteğini kabul edebilmelidir.
- **FR-19**: Kabul edilen bağlantılar “kabul edilmiş” olarak listelenmelidir.
- **FR-20**: Kullanıcı kendi gönderdiği bekleyen bağlantı isteklerini görebilmelidir.
- **FR-21**: Kullanıcı kendine bağlı bir kullanıcıya tekrar bağlantı isteği gönderememelidir.

### 3.5 Arayüz ve Navigasyon

- **FR-22**: Üst menüde (navbar) giriş yapmış kullanıcılar için: Akış, Bağlantılar, Profil, Çıkış linkleri bulunmalıdır.
- **FR-23**: Giriş yapmamış kullanıcılar için: Giriş ve Kayıt Ol butonları görünmelidir.
- **FR-24**: Tüm formlar (login/register/profile edit/post create) validasyon hatalarını Türkçe göstermelidir.

---

## 4. Fonksiyonel Olmayan Gereksinimler (NFR)

### 4.1 Performans

- **NFR-1**: Ana sayfa (feed) normal internet bağlantısında 2–3 saniye içinde yüklenmelidir.
- **NFR-2**: API istekleri için ortalama cevap süresi 500 ms altında tutulmalıdır (geliştirme ortamı hariç).

### 4.2 Güvenlik

- **NFR-3**: Şifreler hash’lenmiş olarak saklanmalıdır (Django varsayılan PBKDF2).
- **NFR-4**: Tüm state-changing (POST/PUT/PATCH/DELETE) istekler CSRF korumalı olmalıdır (uygun yerlerde).
- **NFR-5**: JWT token’lar HTTP Only olmasa bile, frontend’de yalnızca güvenli şekilde yönetilmelidir (localStorage veya secure storage).
- **NFR-6**: Kullanıcı sadece kendisine ait gönderi ve profili değiştirebilmelidir.

### 4.3 Kullanılabilirlik

- **NFR-7**: Arayüz responsive olmalı, en azından 360px mobil ekranlarda bozulmamalıdır.
- **NFR-8**: Hata ve başarı mesajları sade ve Türkçe olmalıdır.

### 4.4 Bakım ve Genişletilebilirlik

- **NFR-9**: Backend modüler app yapısına (users, posts, connections) sahip olmalıdır.
- **NFR-10**: API uç noktaları versiyonlanabilir olacak şekilde tasarlanmalıdır (gelecekte `/api/v1/` vb. için uygun yapı).

---

## 5. Dış Arayüz Gereksinimleri

### 5.1 Kullanıcı Arayüzü

Ekran görüntüleri `docs/screenshots/` klasörüne eklenecektir. Önerilen dosya adları:

- `login.png` – Giriş ekranı  
- `register.png` – Kayıt ekranı  
- `feed.png` – Gönderi akışı  
- `profile.png` – Profil sayfası  
- `profile-edit.png` – Profil düzenleme  
- `connections.png` – Bağlantılar  

Örnek referans (SRS içinde kullanmak istersen):

```markdown
![Giriş Ekranı](screenshots/login.png)
![Akış Ekranı](screenshots/feed.png)
```

### 5.2 Donanım Arayüzü

- Sunucu için özel bir donanım gereksinimi yoktur; tipik bir geliştirme makinesi yeterlidir.

### 5.3 Yazılım Arayüzleri

- Django REST Framework (backend API)
- PostgreSQL / SQLite veritabanı sürücüleri
- React + Axios (frontend HTTP istemcisi)

---

## 6. Sistem Senaryoları (Use Cases)

### UC-1: Kayıt Olma

- **Aktör**: Ziyaretçi  
- **Önkoşul**: Kullanıcı giriş yapmamış olmalı.  
- **Akış**:
  1. Kullanıcı `/register` sayfasını açar.
  2. Zorunlu alanları doldurur (kullanıcı adı, e-posta, şifre, şifre tekrar).
  3. “Kayıt Ol” butonuna basar.
  4. Sistem alanları doğrular, kullanıcıyı oluşturur ve otomatik giriş yapar.
  5. Kullanıcı `/feed` sayfasına yönlendirilir.
- **Alternatif Akış**:
  - 3a. Şifreler eşleşmez → sayfada “Şifreler eşleşmiyor” hatası gösterilir.
  - 3b. Kullanıcı adı/e-posta zaten alınmış → ilgili alan için hata mesajı gösterilir.

### UC-2: Giriş Yapma

- **Aktör**: Kayıtlı Kullanıcı  
- **Akış**:
  1. Kullanıcı `/login` sayfasını açar.
  2. Kullanıcı adı ve şifreyi girer.
  3. “Giriş Yap” butonuna basar.
  4. Sistem kimlik bilgilerini doğrular, JWT üretir ve kullanıcıyı `/feed` sayfasına alır.

### UC-3: Gönderi Paylaşma

- **Aktör**: Kayıtlı Kullanıcı  
- **Akış**:
  1. Kullanıcı `/feed` sayfasında gönderi formuna içerik yazar.
  2. “Paylaş” butonuna basar.
  3. Sistem gönderiyi kaydeder ve liste başına ekler.

### UC-4: Bağlantı İsteği Gönderme ve Kabul Etme

- **Aktör**: Kayıtlı Kullanıcı  
- **Akış**:
  1. Kullanıcı başka bir kullanıcının profilini görüntüler.
  2. “Bağlantı İsteği Gönder” butonuna basar (gelecek geliştirme).
  3. Hedef kullanıcı `/connections` sayfasında isteği görür.
  4. “Kabul Et” butonuna basar, bağlantı durumu ACCEPTED olur.

---

## 7. Kısıtlar

- Yalnızca web tarayıcı tabanlı istemci (mobil uygulama yok).
- Gerçek zamanlı bildirim (WebSocket) bu sürümde yok, ilerisi için planlanabilir.

---

## 8. Gelecek Geliştirmeler

- Yorum sistemi (post yorumları)
- Bildirim sistemi (bağlantı isteği, beğeni bildirimi)
- Mesajlaşma modülü
- Arama (kullanıcı ve gönderi arama)
- Dosya / resim ekli gönderiler


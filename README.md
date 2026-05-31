# Akıllı Sınav Haftası Planlayıcı

Yapay zeka destekli çalışma planı oluşturma sistemi.

## Proje Hakkında

Akıllı Sınav Haftası Planlayıcı, öğrencilerin sınav dönemlerinde çalışma sürelerini daha verimli yönetmelerini sağlamak amacıyla geliştirilmiş bir web uygulamasıdır.

Sistem öğrencinin:

* Bilgi seviyesi
* Ders zorluğu
* Önceki notu
* Eksiklik düzeyi
* Sınava kalan gün sayısı
* Günlük çalışma süresi

bilgilerini analiz ederek kişiselleştirilmiş çalışma planı oluşturmaktadır.

## Kullanılan Teknolojiler

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Veritabanı

* MongoDB Atlas
* Mongoose

### Yapay Zeka

* Python
* Scikit-Learn
* Decision Tree Classifier

## Yapay Zeka Modeli

Projede Decision Tree Classifier algoritması kullanılmıştır.

Model aşağıdaki özellikleri kullanmaktadır:

* knowledgeLevel
* difficulty
* previousGrade
* missingLevel
* daysLeft

Model çıktıları:

* low
* medium
* high
* very_high

öncelik seviyelerinden oluşmaktadır.

Model eğitiminde yaklaşık **%94.89 doğruluk oranı** elde edilmiştir.

## Sistem Mimarisi

```text
Kullanıcı
    ↓
React Frontend
    ↓
Node.js API
    ↓
Decision Tree Modeli
    ↓
Planlama Motoru
    ↓
MongoDB Atlas
```

## Özellikler

* Günlük çalışma süresi belirleme
* Sınırsız ders ekleme
* Yapay zeka ile öncelik belirleme
* Kişiselleştirilmiş çalışma planı oluşturma
* Görev bazlı çalışma dağılımı
* Konu çalışma planı
* Soru çözüm planı
* Tekrar planı
* Dashboard ekranı
* MongoDB kayıt sistemi

## Kurulum

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Yapay Zeka Modeli

```bash
cd ml-model
python train_model.py
```

## Kullanım

1. Günlük çalışma süresi girilir.
2. Ders bilgileri eklenir.
3. Sistem yapay zeka modeli ile öncelikleri belirler.
4. Çalışma planı oluşturulur.
5. Sonuç ekranında günlük program görüntülenir.

## Proje Ekibi

| Ad Soyad           | Öğrenci No |
| ------------------ | ---------- |
| Sevim Akdeniz      | 232804008  |
| Serenay Arguç      | 232802067  |
| Zeynep Arda Yıldız | 232804014  |

## Ders Bilgileri

**Üniversite:** Manisa Celal Bayar Üniversitesi
**Fakülte:** Teknoloji Fakültesi
**Ders:** Yapay Zeka
**Dönem:** 2025-2026 Bahar Dönemi
**Öğretim Üyesi:** Elif Varol Altay

## Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

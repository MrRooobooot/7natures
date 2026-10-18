# 7 Natures — وب‌سایت

سایت تک‌صفحه‌ای و بدون نیاز به build. فقط HTML، CSS و یک فایل JS کوچک.

## اجرا

فایل `index.html` را در مرورگر باز کنید. برای تست با سرور محلی:

```bash
cd /Users/aidin/Documents/Personal/7/website && python3 -m http.server 8000
```

سپس `http://localhost:8000` را باز کنید.

## ویرایش‌های مهم

- **لینک یوتیوب**: `assets/js/main.js`، ثابت `YOUTUBE_CHANNEL_URL` (همه‌ی دکمه‌ها از همین مقدار استفاده می‌کنند).
- **رنگ‌ها و فاصله‌ها**: `assets/css/style.css`، بخش `:root`. سبز برند `#7cd44c` است.
- **متن و ویدیوها**: `index.html`. هر کارت ویدیو یک `<a data-youtube-link>` است.
- **تصاویر**: `assets/img/`. نسخه‌های وب از فایل‌های منبع ساخته شده‌اند و فایل‌های اصلی دست‌نخورده‌اند.
- **لوگو**: `assets/logo.svg` و `assets/favicon.svg` (مربع سبز با عدد ۷).

## فونت

Vazirmatn از Google Fonts بارگذاری می‌شود. اگر اینترنت نباشد، سایت با فونت سیستم نمایش داده می‌شود.

## موارد باز

جزئیات در [REVIEW.md](REVIEW.md) آمده است.

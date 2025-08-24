# Kalkulator Matriks - Kelompok 10 Kelas B

Aplikasi web untuk menghitung berbagai operasi matriks menggunakan HTML, CSS, dan JavaScript. Aplikasi ini adalah konversi dari aplikasi Python Streamlit ke format web statis agar dapat di-deploy di GitHub Pages.

## ✨ Fitur

- **Nilai Eigen & Vektor Eigen**: Menghitung eigenvalues dan eigenvectors dari matriks persegi
- **Diagonalisasi**: Melakukan diagonalisasi matriks dengan verifikasi P⁻¹AP = D
- **Dekomposisi LU**: Dekomposisi matriks menjadi Lower dan Upper triangular dengan pivoting
- **Dekomposisi Cholesky**: Dekomposisi untuk matriks symmetric positive definite (dengan auto-correction)
- **Dekomposisi Doolittle**: Variasi dekomposisi LU dengan L memiliki diagonal 1
- **Dekomposisi Crout**: Variasi dekomposisi LU dengan U memiliki diagonal 1

## 🔧 Perbaikan dari Versi Sebelumnya

### Fitur Tambahan:
- ✅ Contoh matriks preset untuk testing
- ✅ Automatic matrix preprocessing untuk Cholesky
- ✅ Better error messages dengan konteks
- ✅ Verifikasi hasil decomposition
- ✅ Responsive design untuk mobile

## 📱 Cara Penggunaan

1. **Input Matriks**: 
   ```
   1 -1 -9
   -1 3 -9
   1 -1 3
   ```
   (Pisahkan elemen dengan spasi, baris dengan enter)

2. **Pilih Contoh**: Gunakan dropdown untuk memilih matriks contoh
3. **Pilih Metode**: Pilih operasi yang ingin dilakukan
4. **Klik HASIL**: Lihat hasil perhitungan dengan verifikasi

## 🔗 Dependencies

- **Math.js** (v11.11.0) - Library matematika JavaScript untuk operasi matriks
- **HTML5, CSS3, JavaScript** - Teknologi web standar
- **Font: Segoe UI** - Font sistem modern

## 📊 Contoh Matriks yang Tersedia

1. **Matriks Default (3x3)**: Matriks dari contoh Python original
2. **Matriks Symmetric 2x2**: Untuk testing Cholesky decomposition
3. **Matriks Tridiagonal**: Matriks band untuk testing numerik
4. **Matriks Diagonal**: Matriks sederhana untuk verifikasi
5. **Matriks 2x2 Sederhana**: Untuk pembelajaran basic

## ⚡ Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🛠️ Catatan Teknis

- **Math.js CDN**: Menggunakan CDN untuk performa optimal
- **Error Handling**: Comprehensive error handling dengan pesan yang jelas
- **Auto-correction**: Automatic matrix preprocessing untuk Cholesky
- **Numerical Precision**: 6 decimal places dengan trailing zero removal
- **Responsive Design**: Mobile-first approach
- **No Backend**: Pure client-side application

## 🔄 Konversi dari Python

Aplikasi ini adalah konversi 1:1 dari aplikasi Streamlit Python dengan perbaikan:

| Python (Streamlit) | JavaScript (Web) | Status |
|-------------------|------------------|---------|
| `numpy.linalg.eig()` | `math.eigs()` | ✅ Fixed |
| `scipy.linalg.lu()` | `math.lup()` | ✅ Working |
| Custom Cholesky | Improved Cholesky | ✅ Enhanced |
| Custom Doolittle | Enhanced Doolittle | ✅ Better |
| Custom Crout | Enhanced Crout | ✅ Better |

## 👥 Kelompok 10 Kelas B

Aplikasi ini dibuat oleh **Kelompok 10 Kelas B** sebagai tugas mata kuliah dengan konversi dari Python ke JavaScript untuk deployment di GitHub Pages.

---

### 🐛 Troubleshooting

Jika mengalami masalah:
1. Pastikan format matriks benar (spasi antar elemen, enter antar baris)
2. Gunakan matriks persegi untuk eigenvalue/diagonalization
3. Untuk Cholesky, aplikasi akan otomatis membuat matriks symmetric & positive definite
4. Refresh halaman jika ada error JavaScript

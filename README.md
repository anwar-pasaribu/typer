## Typer Problem [solution]

![Whole view](https://github.com/anwar-pasaribu/typer/blob/master/images/all.png)
*Tampilan keseluruhan*
    
Kita mencari developer yang mandiri, ketika ada masalah, aktif mencari solusi dengan sendirinya dan mudah mengerti instruksi tanpa terlalu banyak menanyakan untuk memahami instruksi.     
Berikut adalah aplikasi Javascript yang simple.    
Kami tidak akan menjelaskan bagaimana cara kerjanya atau library apa yang dipakai.   
    
Pertanyaan:   
(1). Sebutkan library apa saja yang dipakai, website library itu dimana, dan dokumentasi library itu ada dimana.

__Library yang dipakai:__
* __Backbone.js → [Homepage Backbone](http://backbonejs.org/), dokumentasi : [Dokumentasi Backbone.js](http://devdocs.io/backbone/)__
* __Twitter Boostrap → [Homepage Bootstrap](http://getbootstrap.com/), dokumentasi: [Dokumentasi Bootstrap](http://getbootstrap.com/)__
* __jQuery → [Homepage jQuery](https://jquery.com/), dokumentasi: [Dokumentasi jQuery](https://api.jquery.com/)__
* __Underscore → [Homepage Underscore.js](http://underscorejs.org/), dokumentasi: [Dokumentasi Underscorejs](http://devdocs.io/underscore/) atau [ini](http://underscorejs.org/)__


(2). Aplikasi itu 'laggy'. Kenapa? Bagaimana cara membuat animasi lebih 'smooth'?

__Aplikasi 'laggy' karena halaman browser harus me-render dan mengubah properti setiap objek div dalam halaman untuk memindahkan div ke bawah. Hal tersebut dapat dilihat pada gambar di bawah ini. Pada gambar warna pink menunjukkan aktivitas pada DOM.__

![DOM Process (Before)](https://github.com/anwar-pasaribu/typer/blob/master/images/dom-process-before.PNG)

__Untuk menangani hal tersebut digunakan CSS3 transform translateY dalam memindahkan div kata-kata. Dimana teknik ini memiliki performa yang lebih baik dibandingkan dengan pemindahan menggunakan properti 'top' [(source)](http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/). Sehingga proses lebih 'smooth' ditandai aktivitas pengubahan objek DOM yang minimal seperti pada gambar di bawah ini.__

![DOM Process (After)](https://github.com/anwar-pasaribu/typer/blob/master/images/dom-process-after.PNG)


(3). Aplikasi itu tidak akan jalan di salah satu 3 browser populer (Chrome, Firefox, Internet Explorer)? Kenapa? Solusinya hanya menghapus satu character di code, character yang mana?

__Aplikasi berjalan pada ketiga Browser tersebut dengan versi masing-masing: Google Chrome (v 49.x), Mozilla Firefox (v 45.0.2), Internet Explorer (v 11.x)__


(4). Implementasikan tombol Start, Stop, Pause, dan Resume.

__Implementasi dapat dilihat seperti gambar berikut:__
![Score view and Buttons](https://github.com/anwar-pasaribu/typer/blob/master/images/button-and-score_annotated.png)

__(1) Tampilan untuk Score, (2) Tombol Stop atau Start, (3) Tombol Resume atau Pause__


(5). Ketika ukuran window dirubah, susunan huruf yang 'terbentur' batas window menjadi tidak 1 baris. Benarkan.

__SUDAH__


(6). Implementasikan sistem score.   

__Sistem score yang dibuat adalah penambahan skor sebanyak jumlah huruf, atau kurang tiga jika salah ketik__


(7). Implementasikan hukuman berupa pengurangan nilai bila salah ketik.

__Pengurangan nilai dilakukan dengan mengurangi skor sebanyak tiga__

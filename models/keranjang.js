const mongoose = require('mongoose');

const Keranjang = mongoose.model('Keranjang', new mongoose.Schema({
    keranjangId: {type:String, required: true, unique:true},
    produkId: {type:String, required: true},
    userId: {type:String, required: true},
    namaPelanggan: {type:String, required: true},
    produk: {type: String, required: true},
    ukuran: {type:String, required:true},
    kategori: {type:String, required:true},
    gambar: {type:String, required:true},
    harga: {type: Number, required: true},
    jumlah: {type: Number, required: true},
    total: {type: Number, required: true}
}))

module.exports = Keranjang;
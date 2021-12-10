const mongoose = require('mongoose');

const Produk = mongoose.model('Produk', new mongoose.Schema({
    produkId: {type:String, required: true, unique:true},
    nama: {type: String, required: true, unique: true},
    kategori: {type: String, required: true},
    harga: {type: Number, required: true},
    gambar: {type: String, required: true}
}))

module.exports = Produk;
const mongoose = require('mongoose');

const Penjualan = mongoose.model('Penjualan', new mongoose.Schema({
    penjualanId: {type:String, required: true, unique:true},
    produk: {type: String, required: true},
    nama_pelanggan: {type: String, required: true},
    harga: {type: Number, required: true},
    jumlah: {type: Number, required: true},
    bukti_pembayaran: {type: String, required: true, default: null},
}))

module.exports = Penjualan;
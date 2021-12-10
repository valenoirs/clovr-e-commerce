const mongoose = require('mongoose');

const Penjualan = mongoose.model('Penjualan', new mongoose.Schema({
    penjualanId: {type:String, required: true, unique:true},
    produk: {type: Array, required: true},
    nama_pelanggan: {type: String, required: true},
    total: {type: Number, required: true},
    bukti_pembayaran: {type: String, required: true, default: null},
}))

module.exports = Penjualan;
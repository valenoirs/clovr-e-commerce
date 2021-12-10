const mongoose = require('mongoose');

const Pelanggan = mongoose.model('Pelanggan', new mongoose.Schema({
    pelangganId: {type:String, required: true, unique:true},
    nama: {type: String, required: true, unique:true},
    alamat: {type: Number, required: true},
    no_hp: {type: Number, required: true}
}))

module.exports = Pelanggan;
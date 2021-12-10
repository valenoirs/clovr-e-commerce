const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    userId: {type:String, required: true, unique:true},
    username: {type:String, required: true, unique:true},
    password: {type: String, required: true},
    nama: {type: String, required: true},
    alamat: {type: String, required: true},
    no_hp: {type: String, required: true}
}))

module.exports = User;
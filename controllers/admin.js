const {v4: uuidv4} = require('uuid');
const comparePassword = require('../utils/comparePassword');
const formidable = require('formidable');
const path = require('path')

// Import Model
const Admin = require('../models/admin');
const Produk = require('../models/produk');
const Keranjang = require('../models/keranjang');

module.exports.Register = async (req, res, next) => {
    try{
        const admin = await Admin.findOne({username: req.body.username});

        console.log(req.body)
        
        if(admin){
            console.log('Admin with corresponding username existed!');
            return res.redirect('/admin/register');
        }

        if(req.body.password !== req.body.confirmPassword){
            console.log('Please enter the same password for confirmation!');
            return res.redirect('/admin/register');
        }

        delete req.body.confirmPassword;

        req.body.adminId = uuidv4();

        const newAdmin = new Admin(req.body);
        await newAdmin.save();

        console.log(newAdmin);
        console.log('Admin registered!');
        return res.redirect('/admin/login');
    }
    catch (error){
        console.error('admin-register-error', error);
        return res.redirect('/admin/register')
    }
}

exports.Login = async (req, res, next) => {
    try{
        const user = await Admin.findOne({username : req.body.username});

        // Cek if user with that username exist
        if(!user) {
            console.log("Account not found");
            return res.redirect('/admin/login');
        }
        
        let isValid = comparePassword(req.body.password, user.password);

        if(!isValid) {
            console.log('Invalid Password!');
            return res.redirect('/admin/login');
        }

        // Success
        req.session.adminId = user.adminId;

        console.log('Logged in!');
        return res.redirect(`/admin/produk`);
    }
    catch(error) {
        console.error("Login Error", error);
        return res.redirect('/admin/login')
    }
}

exports.Logout = async (req, res, next) => {
    try{
        delete req.session.adminId;
        console.log('Logged out!');
        return res.redirect('/admin/login');
    }
    catch (error){
        console.error('logout-error', error);
        return res.redirect('/admin');
    }
}

exports.TambahProduk = (req, res, next) => {
    try{
    const form = new formidable.IncomingForm({uploadDir: path.join(__dirname, '../public/upload'), keepExtensions: true});

    form.parse(req, async (err, fields, files) => {
        console.log(fields);console.log(files);
        const imagePath = `/upload/${files.gambar.newFilename}`;

        const produk = await Produk.findOne({nama: fields.name});

        if(produk){
            console.log('Produk sudah terdaftar!');
            return res.redirect('/admin/produk/tambah')
        }

        fields.produkId = uuidv4();
        fields.gambar = imagePath;
        console.log(fields);
        const newProduk = new Produk(fields)
        await newProduk.save()

        console.log(newProduk);
        console.log('New Produk added!');
        return res.redirect('/admin/produk');
    });

    }
    catch (error){
        console.error('produk-error', error);
        return res.redirect('/admin/produk/tambah');
    }
}

exports.HapusProduk = async (req, res, next) => {
    try{
        await Produk.deleteOne({produkId: req.params.produkId})
        .then(result => {
            console.log('Produk deleted!');
        })
        .catch(error => {
            console.error('produk-error', error);
            return res.redirect('/admin/produk');
        })

        await Keranjang.deleteMany({produkId: req.params.produkId})
        .then(result => {
            console.log('Keranjang deleted!');
        })
        .catch(error => {
            console.error('produk-error', error);
            return res.redirect('/admin/produk');
        })

        return res.redirect('/admin/produk');
    }
    catch (error){
        console.error('produk-error', error);
        return res.redirect('/admin/produk');
    }
}
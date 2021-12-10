const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin');

// Import Model
const Produk = require('../models/produk');
const User = require('../models/user');
const Penjualan = require('../models/penjualan');

// Router
// Post
router.post('/register', AdminController.Register);
router.post('/login', AdminController.Login);
router.post('/produk', AdminController.TambahProduk);

router.get('/logout', AdminController.Logout)

// Delete
router.delete('/produk/:produkId', AdminController.HapusProduk);

// Get
// Produk
router.get('/register', (req, res) => {
    if(!req.session.adminId){
        res.render('admin/register', {title: 'Register - Admin', layout: 'layouts/admin-layout'});
    }
    else{
        return res.redirect('/admin/produk');
    }
})

router.get('/login', (req, res) => {
    if(!req.session.adminId){
        res.render('admin/login', {title: 'Login - Admin', layout: 'layouts/admin-layout'});
    }
    else{
        return res.redirect('/admin/produk');
    }
})

router.get('/produk', async (req, res) => {
    if(!req.session.adminId){
        res.redirect('/admin/login');
    }
    else{
        const data = await Produk.find();
        res.render('admin/produk', {title: 'Produk', layout: 'layouts/admin-layout', data});
    }
})

router.get('/produk/tambah', (req, res) => {
    if(!req.session.adminId){
        res.redirect('/admin/login');
    }
    else{
        res.render('admin/produkT', {title: 'Produk - Tambah', layout: 'layouts/admin-layout'});
    }
})

router.get('/penjualan', async (req, res) => {
    if(!req.session.adminId){
        res.redirect('/admin/login');
    }
    else{
        const data = await Penjualan.find();
        res.render('admin/penjualan', {title: 'Penjualan', layout: 'layouts/admin-layout', data});
    }
})

router.get('/pelanggan', async (req, res) => {
    if(!req.session.adminId){
        res.redirect('/admin/login');
    }
    else{
        const data = await User.find();
        res.render('admin/pelanggan', {title: 'Pelanggan', layout: 'layouts/admin-layout', data});
    }
})

router.get('/penjualan/:penjualanId', async (req, res) => {
    if(!req.session.adminId){
        res.redirect('/admin/login');
    }
    else{
        const data = await Penjualan.findOne({penjualanId : req.params.penjualanId});
        res.render('admin/bukti', {title: 'Bukti', layout: 'layouts/admin-layout', data});
    }
})

module.exports = router;
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

// Import Model
const Produk = require('../models/produk');
const Keranjang = require('../models/keranjang');

// Router
// Post
router.post('/login', UserController.Login);
router.post('/register', UserController.Register);
router.post('/keranjang', UserController.TambahKeranjang)
router.post('/', UserController.Filter)
router.post('/tambahItem', UserController.TambahItem);
router.post('/kurangItem', UserController.KurangItem);
router.post('/pembayaran', UserController.Pembayaran)

// Get
router.get('/logout', UserController.Logout);

router.get('/login', (req, res) => {
    if(!req.session.userId){
        res.render('pembeli/login', {title: 'Login', layout: 'layouts/main-layout'});
    }
    else{
        return res.redirect('/');
    }
})

router.get('/register', (req, res) => {
    if(!req.session.userId){
        res.render('pembeli/register', {title: 'Register', layout: 'layouts/main-layout'});
    }
    else{
        return res.redirect('/');
    }
})

router.get('/keranjang', async (req, res) => {
    if(!req.session.userId){
        res.redirect('/login');
    }
    else{
        const keranjang = await Keranjang.find({userId: req.session.userId});
        res.render('pembeli/keranjang', {title: 'Keranjang', layout: 'layouts/main-layout', keranjang});
    }
})

router.get('/pembayaran', async (req, res) => {
    if(!req.session.userId){
        res.redirect('/login');
    }
    else{
        const keranjang = await Keranjang.find({userId: req.session.userId});
        res.render('pembeli/pembayaran', {title: 'Pembayaran', layout: 'layouts/main-layout', keranjang});
    }
})

router.get('/', async (req, res) => {
    if(!req.session.userId){
        res.redirect('/login');
    }
    else{
        const keranjang = await Keranjang.find({userId: req.session.userId});
        const data = await Produk.find();
        res.render('pembeli/home', {title: 'Home', layout: 'layouts/main-layout', data, keranjang});
    }
})

router.get('/:namaProduk', async (req, res) => {
    if(!req.session.userId){
        res.redirect('/login');
    }
    else{
        const keranjang = await Keranjang.find({userId: req.session.userId});
        const produk = await Produk.findOne({nama: req.params.namaProduk});
        console.log(produk)
        res.render('pembeli/produk', {title: 'Produk', layout: 'layouts/main-layout', produk, keranjang});
    }
})

module.exports = router;
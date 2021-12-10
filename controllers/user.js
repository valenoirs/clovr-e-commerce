const {v4: uuidv4} = require('uuid');
const comparePassword = require('../utils/comparePassword');
const formidable = require('formidable');
const path = require('path');

// Import Model
const User = require('../models/user');
const Keranjang = require('../models/keranjang');
const Penjualan = require('../models/penjualan');

module.exports.Register = async (req, res, next) => {
    try{
        const user = await User.findOne({username: req.body.username});

        if(user){
            console.log('User with corresponding username existed!');
            return res.redirect('/register');
        }

        if(req.body.password !== req.body.confirmPassword){
            console.log('Please enter the same password for confirmation!');
            return res.redirect('/register');
        }

        delete req.body.confirmPassword;

        req.body.userId = uuidv4();

        const newUser = new User(req.body);
        await newUser.save();

        console.log('User account registered!');
        return res.redirect('/login');
    }
    catch (error){
        console.error('register-error', error);
        return res.redirect('/register')
    }
}

exports.Login = async (req, res, next) => {
    try{
        const user = await User.findOne({username : req.body.username});

        // Cek if user with that username exist
        if(!user) {
            console.log("Account not found");
            return res.redirect('/login');
        }
        
        let isValid = comparePassword(req.body.password, user.password);

        if(!isValid) {
            console.log('Invalid Password!');
            return res.redirect('/login');
        }

        // Success
        req.session.userId = user.userId;

        console.log('Logged in!');
        return res.redirect(`/`);
    }
    catch(error) {
        console.error("Login Error", error);
        return res.redirect('/login')
    }
}

exports.Logout = async (req, res, next) => {
    try{
        delete req.session.userId;
        console.log('Logged out!');
        return res.redirect('/login');
    }
    catch (error){
        console.error('logout-error', error);
        return res.redirect('/');
    }
}

exports.Filter = async (req, res, next) => {
    try{
        console.log(req.body);

        console.log('Filtered');
        return res.redirect('/');
    }
    catch (error){
        console.error('filter-error', error);
        return res.redirect('/');
    }
}

exports.TambahKeranjang = async (req, res, next) => {
    try{
        const item = await Keranjang.findOne({produk: req.body.produk, ukuran: req.body.ukuran});
        const pelanggan = await User.findOne({userId: req.session.userId});
        console.log(item);        

        if(item){
            const newJumlah = item.jumlah + parseInt(req.body.jumlah)
            const newTotal = item.harga * newJumlah

            await Keranjang.updateOne({keranjangId: item.keranjangId}, {
                $set: {
                    jumlah: newJumlah,
                    total: newTotal
                }
            })

            console.log('1 item updated!');
            return res.redirect('back')
        }
        
        const total = req.body.harga * req.body.jumlah;
        
        req.body.total = total;
        req.body.keranjangId = uuidv4();
        req.body.userId = req.session.userId;
        req.body.namaPelanggan = pelanggan.nama;

        const newKeranjang = new Keranjang(req.body);
        await newKeranjang.save();

        console.log(newKeranjang);
        console.log('Item added!');
        return res.redirect('back');
    }
    catch (error){
        console.error('keranjang-error', error);
        return res.redirect('back');
    }
}

exports.TambahItem = async (req, res, next) => {
    try{
        const item = await Keranjang.findOne({keranjangId: req.body.keranjangId});
        console.log(item);

        if(item){
            const newJumlah = item.jumlah + 1;
            const newTotal = newJumlah * item.harga;

            await Keranjang.updateOne({keranjangId: item.keranjangId}, {
                $set: {
                    jumlah: newJumlah,
                    total: newTotal
                }
            })
            
            console.log('1 item bertambah');
            return res.redirect('/keranjang');
        }

        console.log('Tambah item jadi!');
        return res.redirect('/keranjang');
    }
    catch (error){
        console.error('tambah-item-error', error);
        return res.redirect('/keranjang');
    }
}

exports.KurangItem = async (req, res, next) => {
    try{
        const item = await Keranjang.findOne({keranjangId: req.body.keranjangId})
        console.log(item);

        if(item){
            const newJumlah = item.jumlah - 1;
            const newTotal = newJumlah * item.harga;
            if(item.jumlah > 1){
                await Keranjang.updateOne({keranjangId: item.keranjangId}, {
                    $set: {
                        jumlah: newJumlah,
                        total: newTotal
                    }
                });
                
                console.log('1 item berkurang');
                return res.redirect('/keranjang');
            }
            else{
                await Keranjang.deleteOne({keranjangId: item.keranjangId})
                .then(console.log('1 item dihapus'))
                .catch(error => console.log(error));
            }
        }

        console.log('Kurang item jadi!');
        return res.redirect('/keranjang');
    }
    catch (error){
        console.error('kurang-item-error', error);
        return res.redirect('/keranjang');
    }
}

exports.Pembayaran = async (req, res, next) => {
    try{
        const form = new formidable.IncomingForm({uploadDir: path.join(__dirname, '../public/upload/bukti-pembayaran'), keepExtensions: true});
        
        const keranjang = await Keranjang.find({userId: req.session.userId});
        console.log(keranjang);
        let produk = [];

        form.parse(req, async (err, fields, files) => {

            console.log(files);
            const imagePath = `/upload/bukti-pembayaran/${files.bukti_pembayaran.newFilename}`;
            
            keranjang.forEach(item => {
                produk.push({jumlah: item.jumlah, produk: item.produk})
            })
            
            let total = keranjang.map(item => item.total).reduce((prev, next) => prev + next);

            await Penjualan.insertMany({
                penjualanId: uuidv4(),
                produk,
                nama_pelanggan: keranjang[0].namaPelanggan,
                total,
                bukti_pembayaran: imagePath
            })
            
            await Keranjang.deleteMany({userId: req.session.userId})
            .then(console.log('Keranjang Dikosongkan!'))
            .catch(error => console.log(error));

            console.log('Transaksi Berhasil!');
            return res.redirect('/');
        });
    }
    catch (error){
        console.error('pembayaran-error', error);
        return res.redirect('/pembayaran');
    }
}
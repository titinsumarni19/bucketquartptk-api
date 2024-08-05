const transaksiModel = require('../models/transaksi')
const mongoose = require('mongoose')
const objectId = mongoose.Types.ObjectId
const multer = require('multer')
const path = require('path')


// Configuring multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './static');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 20000000 } }).single('buktiPembayaran');

// Create transaction
exports.create = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json({
                sukses: false,
                msg: 'Gagal upload bukti pembayaran',
                error: err.message
            });
        }

        let { idUser, produkItems, totaltransaksi, status} = req.body;
        const buktiPembayaran = req.file ? req.file.filename : null;

        if (!produkItems || !Array.isArray(produkItems)) {
            return res.status(400).json({
                sukses: false,
                msg: 'produkItems harus berupa array'
            });
        }

        const validProdukItems = produkItems.every(item => 
            item.idProduk && mongoose.Types.ObjectId.isValid(item.idProduk) && item.kuantitas);

        if (!validProdukItems) {
            return res.status(400).json({
                sukses: false,
                msg: 'produkItems = idProduk atau kuantitas, invalid'
            });
        }
        
        const newTransaksi = new transaksiModel({
            idUser,
            produkItems: produkItems.map(item => ({
                idProduk: new mongoose.Types.ObjectId(item.idProduk),
                kuantitas: item.kuantitas
            })),
            totaltransaksi,
            status,
            buktiPembayaran,
        });

        newTransaksi.save()
            .then(() => {
                res.status(201).json({
                    sukses: true,
                    msg: 'Berhasil Transaksi'
                });
            })
            .catch((error) => {
                console.error('Database Save Error:', error);
                res.status(500).json({
                    sukses: false,
                    msg: 'Gagal Transaksi',
                    error: error.message
                });
            });
    });
};

// Get all transactions
exports.getAllTransaksi = async (req, res) => {
    try {
        const transaksis = await transaksiModel.find()
            .populate('idUser', 'namalengkap alamat telepon')
            .populate({
                path: 'produkItems.idProduk', 
                select: 'namaproduk harga' 
            })
            .exec(); // Populate idUser to get user details

        res.status(200).json({
            status: 200,
            msg: 'Berhasil Mengambil Data',
            data: transaksis
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: 'Gagal Mengambil Data',
            data: [],
            error: error.message
        });
    }
};



exports.getTransaksiById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const transaksi = await transaksiModel.findById(id)
            .populate('idUser', 'namalengkap alamat telepon')
            .populate({
                path: 'produkItems.idProduk', 
                select: 'namaproduk harga' 
            }).exec(); // Populate idUser to get user details 

        if (!transaksi) {
            return res.status(404).json({
                status: 404,
                msg: 'Transaksi not found',
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            msg: 'Berhasil Mengambil Data',
            data: transaksi
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: 'Gagal Mengambil Data',
            data: null,
            error: error.message
        });
    }
};

// Fungsi untuk mengupdate berat, detail, dan status
exports.updateTransaksi = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedTransaksi = await transaksiModel.findByIdAndUpdate(
            id,
            {
                status: status,
            },
            { new: true }
        ).populate('idUser', 'namalengkap alamat telepon')  // Populate idUser to get user details
        .populate({
            path: 'produkItems.idProduk', 
            select: 'namaproduk harga' 
        }).exec();

        if (!updatedTransaksi) {
            return res.status(404).json({
                status: 404,
                msg: 'Transaksi not found',
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            msg: 'Transaksi updated successfully',
            data: updatedTransaksi
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: 'Failed to update Transaksi',
            data: null,
            error: error.message
        });
    }
};

exports.deleteTransaksi = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTransaksi = await transaksiModel.findByIdAndDelete(id);

        if (!deletedTransaksi) {
            return res.status(404).json({
                status: 404,
                msg: 'Transaksi tidak ditemukan',
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            msg: 'Berhasil menghapus transaksi',
            data: deletedTransaksi
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: 'Gagal menghapus transaksi',
            data: null,
            error: error.message
        });
    }
};
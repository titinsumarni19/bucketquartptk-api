const produkModel = require('../models/produk')
const mongoose = require('mongoose')
const objectId = mongoose.Types.ObjectId
const multer = require('multer')
const path = require('path')
const fs = require('fs');

// Configuring multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './static');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 2000000 } }).single('image');

// Create Produk
exports.create = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json({
                sukses: false,
                msg: 'Gagal upload image',
                error: err.message
            });
        }

        const {namaproduk, idKategori, deskripsi, stok, harga } = req.body;
        const image = req.file ? req.file.filename : null;

        const newProduk = new produkModel({
            namaproduk,
            idKategori,
            deskripsi,
            stok,
            harga,
            image
        });

        newProduk.save()
            .then(() => {
                res.status(201).json({
                    sukses: true,
                    msg: 'Berhasil menambahkan produk'
                });
            })
            .catch((error) => {
                res.status(500).json({
                    sukses: false,
                    msg: 'Gagal menambahkan produk',
                    error: error.message
                });
            });
    });
};

exports.getAllProduk = async (req, res) => {
    try {
        const produks = await produkModel.find() // Populate idUser to get user details
            .populate('idKategori', 'namakategori')  // Populate idKategori to get paket details

        res.status(200).json({
            status: 200,
            msg: 'Berhasil Mengambil Data',
            data: produks
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

exports.getProdukById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const produk = await produkModel.findById(id)
            .populate('idKategori', 'namakategori')  // Populate idKategori to get paket details

        if (!produk) {
            return res.status(404).json({
                status: 404,
                msg: 'produk not found',
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            msg: 'Berhasil Mengambil Data',
            data: produk
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

exports.edit = (id, data) =>
    new Promise(async (resolve, reject) => {
        try {
            // Update the document first
            await produkModel.updateOne({ _id: id }, data);

            // Find the updated document and populate 'idKategori'
            const updatedDocument = await produkModel.findOne({ _id: id }).populate('idKategori');

            if (updatedDocument) {
                resolve({ sukses: true, msg: 'Berhasil Edit Data', data: updatedDocument });
            } else {
                reject({ sukses: false, msg: 'Gagal menemukan dokumen yang diperbarui' });
            }
        } catch (err) {
            reject({ sukses: false, msg: err.message });
        }
    })
    .catch((err) => {
        console.error('Unhandled promise rejection:', err);
    });


// exports.updateProduk = async (req, res) => {
//     const { id } = req.params;
//     const { namaproduk,  deskripsi, stok, harga} = req.body;
//     const image = req.file ? req.file.filename : null;

//     try {
//         const updatedProduk = await produkModel.findByIdAndUpdate(
//             id,
//             {
//                 namaproduk: namaproduk,
//                 deskripsi: deskripsi,
//                 stok: stok,
//                 harga: harga,
//                 if (image) {
//                     image;
//                 }
//             },
//             { new: true }
//         ).populate('idKategori');

//         if (!updatedProduk) {
//             return res.status(404).json({
//                 status: 404,
//                 msg: 'Produk tidak ditemukan',
//                 data: null
//             });
//         }

//         res.status(200).json({
//             status: 200,
//             msg: 'Produk Berhasil Diupdate',
//             data: updatedProduk
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             msg: 'Gagal update produk',
//             data: null,
//             error: error.message
//         });
//     }
// };

// Update promo by ID
exports.updateProduk = async (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Multer error', error: err.message });
        } else if (err) {
            return res.status(500).json({ message: 'Unknown error', error: err.message });
        }

        const { id } = req.params;
        const { namaproduk, idKategori,  deskripsi, stok, harga } = req.body;
        let image = req.file ? req.file.filename : null; // Ambil nama file jika ada file yang diupload

        try {
            let existingProduk = await produkModel.findById(id);
            if (!existingProduk) {
                return res.status(404).json({
                    status: 404,
                    msg: 'Promo not found',
                    data: null
                });
            }

            // Handle image upload if there's a new image
            if (req.file) {
                const imagePath = path.join(__dirname, '../static', existingProduk.image);
                // Delete existing image if it exists
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
                // Update image path in database
                image = req.file.filename;
            } else {
                // If no new image, keep the existing one
                image = existingProduk.image;
            }

            // Update promo data
            existingProduk.namaproduk = namaproduk;
            existingProduk.idKategori = idKategori;
            existingProduk.deskripsi = deskripsi;
            existingProduk.stok = stok;
            existingProduk.harga = harga;
            existingProduk.image = image;

            // Save updated promo data
            const updatedProduk = await existingProduk.save();

            res.status(200).json({
                status: 200,
                msg: 'Produk berhasil di update',
                data: updatedProduk
            });
        } catch (error) {
            console.error('Gagal update produk:', error);
            res.status(500).json({
                status: 500,
                msg: 'Gagal update produk',
                data: null,
                error: error.message
            });
        }
    });
};

exports.deleteProduk = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduk = await produkModel.findByIdAndDelete(id);

        if (!deletedProduk) {
            return res.status(404).json({
                status: 404,
                msg: 'Produk tidak ditemukan',
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            msg: 'Berhasil menghapus Produk',
            data: deletedProduk
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: 'Gagal menghapus Produk',
            data: null,
            error: error.message
        });
    }
};



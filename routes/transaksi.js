const router = require('express').Router()
const transaksiController = require('../controllers/transaksiController')
const uploadConfig = require('../uploadConfig')
const fields = uploadConfig.upload.fields([
    {
        name: 'buktiPembayaran',
        maxCount: 1
    }
]);

router.post('/create', transaksiController.create);

router.put('/upload-bukti/:id', fields, (req, res) => {
    req.body.buktiPembayaran = req.files.buktiPembayaran[0].filename

    transaksiController.uploadBuktiBayar(req.params.id, req.body)
        .then(result => res.json(result))
        .catch(err => res.json(err))
});

router.get('/getalltransaksi', transaksiController.getAllTransaksi);

router.get('/gettransaksibyid/:id', transaksiController.getTransaksiById);
// Rute untuk mengupdate transaksi
router.put('/update/:id', transaksiController.updateTransaksi);

router.delete('/delete/:id', transaksiController.deleteTransaksi);


module.exports = router
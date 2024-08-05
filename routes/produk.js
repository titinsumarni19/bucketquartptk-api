const router = require('express').Router()
const produkController = require('../controllers/produkController')
const uploadConfig = require('../uploadConfig')
const fields = uploadConfig.upload.fields([
    {
        name: 'image',
        maxCount: 1
    }
])

router.post('/create', produkController.create)

router.put('/upload-gambar/:id', fields, (req, res) => {
    req.body.gambar = req.files.gambar[0].filename

    produkController.uploadGambar(req.params.id, req.body)
        .then(result => res.json(result))
        .catch(err => res.json(err))
})

router.get('/getallproduk', produkController.getAllProduk);
router.get('/getprodukbyid/:id', produkController.getProdukById);
router.put('/edit/:id', produkController.updateProduk);
router.delete('/delete/:id', produkController.deleteProduk);

module.exports = router
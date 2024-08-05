const router = require('express').Router()
const produkKategoriController = require('../controllers/produkKategoriController')
router.post('/create', (req, res) => {
  // console.log(req.body)
  produkKategoriController.create(req.body)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

router.put('/edit/:id', (req, res) => {
  const data = req.body
  console.log(data)
  produkKategoriController.edit(req.params.id, data)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})


router.get('/getallkategori', produkKategoriController.getAllKategori);

router.get('/getkategoribyid/:id', (req, res) => {
  console.log(req.params.id)
  produkKategoriController.getKategoriById(req.params.id)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

router.delete('/delete/:id', (req, res) => {
  produkKategoriController.delete(req.params.id)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})


module.exports = router
const router = require('express').Router()
const express = require('express')
const userController = require('../controllers/userController')

router.use(express.json());

router.post('/register', (req,res) => {
    userController.register(req.body)
        .then(result => res.json(result))
        .catch(err => res.json(err))
})

router.post('/login', (req,res) => {
    userController.login(req.body)
        .then(result => res.json(result))
        .catch(err => res.json(err))
})

// Route untuk mengedit pengguna berdasarkan ID
router.put('/edit/:id', (req, res) => {
    const data = req.body; // Ambil data dari body permintaan
    console.log(data); // Log data untuk keperluan debugging

    userController.edit(req.params.id, data)
        .then(result => res.json(result)) // Kirim respons JSON jika berhasil
        .catch(err => res.status(500).json(err)); // Kirim pesan kesalahan jika terjadi masalah
});

// Route untuk mendapatkan semua pengguna
router.get('/getAllUsers', userController.getAllUsers);

// Route untuk DELETE user berdasarkan ID
router.delete('/delete/:id', userController.deleteUser);

router.get('/getbyid/:id', (req, res) => {
    console.log(req.params.id)
    userController.getById(req.params.id)
      .then(result => res.json(result))
      .catch(err => res.json(err))
  })

module.exports = router
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const mongoUrl = 'mongodb://127.0.0.1:27017/BucketquartPtk'
const cors = require('cors')
const path = require('path')

mongoose.set('strictQuery', false)

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Berhasil Connect Ke Database')
}).catch((e) => {
    console.log(e)
    console.log('Gagal Connect Ke Database')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const directory = path.join(__dirname, 'static')
app.use('/static', express.static(directory))

app.use('/user', require('./routes/user'))
app.use('/produk', require('./routes/produk'))
app.use('/transaksi', require('./routes/transaksi'))
app.use('/kategori', require('./routes/produkKategori'))


app.listen(5002, '0.0.0.0', () => {
    console.log('Berhasil Jalan')
})
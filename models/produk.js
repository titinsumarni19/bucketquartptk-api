const mongoose = require('mongoose')
const Schema = mongoose.Schema
const objectId = mongoose.Types.ObjectId

const produkSchema = new Schema({
    namaproduk: {
      type: String
    },
    idKategori: { type: mongoose.Schema.Types.ObjectId, ref: 'kategori'},
    deskripsi: {
      type: String
    },
    stok: {
      type: String
    },
    harga: {
        type: Number
      },
    image: {
      type: String,
      default: null },
})

module.exports = mongoose.model('produk', produkSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const objectId = mongoose.Types.ObjectId


const transaksiSchema = new Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    produkItems: [{
        idProduk: { type: mongoose.Schema.Types.ObjectId, ref: 'produk'},
        kuantitas: { type: Number, required: true }
    }],
    totaltransaksi : {type: String},
    status: { type: Number, default: 0 },
    buktiPembayaran: { type: String, default: null },
    detail: { type: String, default: null },
    tanggal: {
        type: Date,
        default: new Date().toLocaleDateString(),  // format DD/MM/YYYY
    },
});


module.exports=mongoose.model('transaksi',transaksiSchema)
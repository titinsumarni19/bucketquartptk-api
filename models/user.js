const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    namalengkap: {
        type: String
    },
    telepon: {
        type: String
    },
    email: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    alamat: {
        type: String,
        default: ''
    },
    role: {
        type: Number,
        default: 1 // 1 user biasa 2 admin
    }
})

module.exports = mongoose.model('user', userSchema)
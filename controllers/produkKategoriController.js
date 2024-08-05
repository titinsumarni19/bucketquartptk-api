const produkKategoriModel = require('../models/produkKategori')

exports.create = (data) =>
  new Promise((resolve, reject) => {
    produkKategoriModel.create(data)
      .then(() => {
        resolve({
          sukses: true,
          msg: 'Berhasil Menyimpan Data'
        })
      }).catch((e) => {
        console.log(e)
        reject({
          sukses: false,
          msg: 'Gagal Menyimpan Data'
        })
      })
  })

  exports.getAllKategori = async (req, res) => {
    try {
        const kategoris = await produkKategoriModel.find()

        res.status(200).json({
            status: 200,
            msg: 'Berhasil Mengambil Data',
            data: kategoris
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

exports.getKategoriById = (id) =>
  new Promise((resolve, reject) => {
    produkKategoriModel.findOne({
      _id: id
    })
      .then(res => {
        resolve({
          sukses: true,
          msg: 'Berhasil Mengambil Data',
          data: res
        })
      }).catch(() => reject({
        sukses: false,
        msg: 'Gagal Mengmabil Data',
        data: {}
      }))
  })

  exports.edit = (id, data) =>
    new Promise(async (resolve, reject) => {
      try {
        produkKategoriModel.updateOne({ _id: id }, data)
          .then(() => resolve({ sukses: true, msg: 'Berhasil Edit Data' }))
          .catch((err) => reject({ sukses: false, msg: 'Gagal Edit Data' }));
      } catch (err) {
        reject({ sukses: false, msg: err.message });
      }
    });

exports.delete = (id) =>
  new Promise((resolve, reject) => {
    produkKategoriModel.deleteOne({
      _id: id
    }).then(() => resolve({
      sukses: true,
      msg: 'Berhasil Hapus Data'
    })).catch(() => reject({
      sukses: false,
      msg: 'Gagal Hapus Data'
    }))
  })
const userModel = require('../models/user')
const bcrypt = require('bcrypt')

exports.register = (data) =>
    new Promise((resolve, reject) => {
        userModel.findOne({
            username: data.username
        }).then(user => {
            if (user) {
                reject({
                    sukses: false,
                    msg: 'Username Telah Terdaftar'
                })
            } else {
                bcrypt.hash(data.password, 10, (err, hash) => {
                    data.password = hash
                    userModel.create(data)
                    .then(() => resolve({
                        sukses: true,
                        msg: 'Berhasil Registrasi'
                    })).catch(() => reject({
                        sukses: false,
                        msg: 'Gagal Registrasi'
                    }))
                })
            }
        })
    })

exports.login = (data) =>
    new Promise((resolve, reject) => {
        userModel.findOne({
            username: data.username
        }).then(user => {
            if (user) {
                if (bcrypt.compareSync(data.password, user.password)) {
                  
                    resolve({
                        sukses: true,
                        msg: 'Berhasil Login',
                        data: user
                    })
                } else {
                    reject({
                        sukses: false,
                        msg: 'Password Anda Salah'
                    })
                }
            } else {
                reject({
                    sukses: false,
                    msg: 'Username Tidak Terdaftar'
                })
            }
        })
    })

    exports.edit = (id, data) =>
      new Promise(async (resolve, reject) => {
        try {
          // Cek jika password diubah
          if (data.password) {
            // Encrypt password
            data.password = await bcrypt.hash(data.password, 10);
          } else {
            // Jika password tidak diubah, gunakan password lama dari database
            const existingUser = await userModel.findOne({ _id: id });
            if (existingUser) {
              data.password = existingUser.password; // Gunakan password lama
            } else {
              delete data.password; // Hapus properti password jika tidak ada pengguna dengan ID tersebut
            }
          }
    
          userModel.updateOne({ _id: id }, data)
            .then(() => resolve({ sukses: true, msg: 'Berhasil Edit Data' }))
            .catch((err) => reject({ sukses: false, msg: 'Gagal Edit Data' }));
        } catch (err) {
          reject({ sukses: false, msg: err.message });
        }
      });


exports.getById = (id) => {
      return new Promise((resolve, reject) => {
          userModel.findById(id)
              .then(user => {
                  if (!user) {
                      return reject({
                          sukses: false,
                          msg: 'User tidak ditemukan',
                          data: {}
                      });
                  }
                  resolve({
                      sukses: true,
                      msg: 'Berhasil Mengambil Data',
                      data: user
                  });
              })
              .catch(err => {
                  console.error('Error saat mengambil data user:', err);
                  reject({
                      sukses: false,
                      msg: 'Gagal Mengambil Data',
                      data: {}
                  });
              });
      });
  };

  exports.getAllUsers = async (req, res) => {
    try {
        let query = {};

        // Jika ada kata kunci pencarian, sesuaikan query
        if (req.query.keyword) {
            query = {
                $or: [
                    { namalengkap: { $regex: req.query.keyword, $options: 'i' } }, // pencarian case-insensitive
                    { username: { $regex: req.query.keyword, $options: 'i' } }
                ]
            };
        }

        // Ambil data pengguna dari database berdasarkan query
        const users = await userModel.find(query);

        res.status(200).json({
            sukses: true,
            msg: 'Berhasil Mengambil Data',
            data: users
        });
    } catch (err) {
        res.status(500).json({
            sukses: false,
            msg: 'Gagal Mengambil Data',
            error: err.message
        });
    }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        sukses: false,
        msg: 'User not found'
      });
    }

    res.status(200).json({
      sukses: true,
      msg: 'User deleted successfully',
      data: deletedUser
    });
  } catch (err) {
    res.status(500).json({
      sukses: false,
      msg: 'Failed to delete user',
      error: err.message
    });
  }
};
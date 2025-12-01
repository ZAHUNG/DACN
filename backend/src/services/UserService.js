const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const { genneralAccessToken, genneralRefreshToken } = require('./JwtService');


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone, address } = newUser;
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already'
                })
            }
            const hash = bcrypt.hashSync(password, 10);
            // console.log('hash', hash)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone,
                address
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'Create user successfully',
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            // console.log('comparePassword', comparePassword)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password of user is incorrect'
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            console.log('access_token', access_token)
            resolve({
                status: 'OK',
                message: ' Login Successfully',
                access_token,
                refresh_token,
            })
            // }
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            console.log('checkUser', checkUser)
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
            // console.log('updateUser', updateUser)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser
            })
            // }
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            // console.log('checkUser', checkUser)
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            const deletedUser = await User.findByIdAndDelete(id)
            // console.log('updateUser', updateUser)
            resolve({
                status: 'OK',
                message: ' Delete user success',
            })
            // }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = (limit = 10, page = 0) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalUser = await User.countDocuments();
            const allUser = await User.find()
                .limit(limit)
                .skip(page * limit);
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser,
                totalUser,
                currentPage: page,
                limit
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            // console.log('checkUser', checkUser)
            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }
            // console.log('updateUser', updateUser)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            })
            // }
        } catch (e) {
            reject(e)
        }
    })
}

const refreshTokenService = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('token', token)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshTokenService
}
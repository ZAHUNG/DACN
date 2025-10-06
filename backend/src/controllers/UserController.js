const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const createUser = async(req, res) => {
    try {
        // console.log(req.body)
        const { email, password, confirmPassword } = req.body;
        const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isCheckEmail = reg.test(email)
        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }else if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }else if(password !== confirmPassword){
            return res.status(200).json({
                status: 'ERR',
                message: 'The password is equal confirmPassword'
            })
        }

        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    }catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async(req, res) => {
    try {
        // console.log(req.body)
        const { email, password } = req.body;
        const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isCheckEmail = reg.test(email)
        if (!email || !password ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }else if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }

        const response = await UserService.loginUser(req.body)
        return res.status(200).json(response)
    }catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async(req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if(!userId){
            returnres.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        console.log('userId', userId)
        const response = await UserService.updateUser(userId, data);
        return res.status(200).json(response)
    }catch (e) {
        return res.status(404).json({
            message: e
        })
    }
} 

const deleteUser = async(req, res) => {
    try {
        const userId = req.params.id
        const token = req.headers
        // console.log('token', token)
        // // console.log('userId', userId)
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        // console.log('userId', userId)
        const response = await UserService.deleteUser(userId);
        return res.status(200).json(response)
    }catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async(req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    }catch (e) {
        return res.status(404).json({
            message: e
        })
    }
} 

const getDetailsUser = async(req, res) => {
    try {
        const userId = req.params.id
        // console.log('token', token)
        // // console.log('userId', userId)
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        // console.log('userId', userId)
        const response = await UserService.getDetailsUser(userId);
        return res.status(200).json(response)
    }catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async(req, res) => {
    try {
        const token = req.headers.token.split(' ')[1]
        // console.log('token', token)
        // // console.log('userId', userId)
        if(!token){
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        // console.log('userId', userId)
        const response = await JwtService.refreshTokenJwtService(token);
        return res.status(200).json(response)
    }catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports ={
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken
}
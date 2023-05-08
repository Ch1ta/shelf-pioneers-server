const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token')

const generateTokens = async(payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:'1m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'})
    return {
        accessToken,
        refreshToken
    }
}

const validateAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (e) {
        return null;
    }
}

const validateRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
        return null
    }
}

const saveToken = async(userId, refreshToken) => {
    const tokenData = await tokenModel.findOne({user: userId});

    if (tokenData) {
        tokenData.refreshToken = refreshToken; //если refreshToken уже есть, то обновляем его
        return tokenData.save(); //
    }

    return await tokenModel.create({user: userId, refreshToken});
}

const removeToken  = async(refreshToken) => {
       return tokenModel.deleteOne({refreshToken});
}

const findToken  = async(refreshToken) => {
    const tokenData = await tokenModel.findOne({refreshToken})
    return tokenData;
}

module.exports = {
    generateTokens,
    saveToken,
    removeToken,
    validateRefreshToken,
    validateAccessToken,
    findToken
}
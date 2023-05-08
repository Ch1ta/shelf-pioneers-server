const UserModel = require('../models/user')
const uuid = require('uuid');
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const bcrypt = require('bcrypt')


const registration = async (username, email, password) => {
    const emailCandidate = await UserModel.findOne({email});

    if (emailCandidate) {
        throw ApiError.BadRequest(`Пользователь с таким адресом уже существует`)
    }

    const nameCandidate = await UserModel.findOne({username});

    if (nameCandidate) {
        throw ApiError.BadRequest(`Это имя занято`)
    }


    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4();

    const user = await UserModel.create({username, email, password:  hashPassword, activationLink})
    await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`);

    const userDto = new UserDto(user); //id, email, isActivated
    const tokens = await tokenService.generateTokens({...userDto})
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {...tokens, user: userDto  }
}

const activate = async(activationLink) => {
    const user = await UserModel.findOne({activationLink});
    if (!user) {
        throw ApiError.BadRequest('Некорректная ссылка активации')
    }
    user.isActivated = true;
    await user.save();
}

const login = async(email, password) => {
    const user = await UserModel.findOne({email})

    if (!user) {
        throw ApiError.BadRequest('Неверный логин ')
    }

    const passEqual = bcrypt.compare(password, user.password)

    if (!passEqual) {
        throw ApiError.BadRequest('Неверный пароль')
    }

    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens, user: userDto}

}

const logout = async(refreshToken) => {
    return await tokenService.removeToken(refreshToken);
}


const refresh  = async(refreshToken) => {
    if (!refreshToken) {
        throw ApiError.UnauthorizedError('Отсутствует refresh token')
    }
    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
        throw ApiError.UnauthorizedError('Невалидный токен')
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = await tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens, user: userDto}
}

const getAllUsers = async() => {
    return UserModel.find();
}


module.exports = {registration, activate, login, logout, refresh, getAllUsers}
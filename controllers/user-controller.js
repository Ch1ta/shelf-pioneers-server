const userService = require('../service/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
const handleError = (res, err) => {
    res.status(500).json({error: err})
}
const registration = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Ошибка валидации', errors.array()));
        }

        const {username, email, password} = req.body;

        const userData = await userService.registration(username, email, password);
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        return res.json(userData)
    } catch (e) {
        next(e)
    }
}
const activate = async (req, res, next) => {
    try {
        const activationLink = req.params.link;
        await userService.activate(activationLink);
        return res.redirect(`${process.env.CLIENT_URL}`)
    } catch (e) {
        next(e)
    }
}
const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const userData = await userService.login(email, password);
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        return res.json(userData)
    } catch (e) {
        next(e)
    }
}
const logout = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        const token = await userService.logout(refreshToken)
        res.clearCookie('refreshToken')
        return res.json(token)

    } catch (e) {
        next(e)
    }
}
const refresh = async (req, res, next) => {
    try {
        const {refreshToken} = req.cookies;
        console.log('refreshToken from cookies: ', refreshToken)
        const userData = await userService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        return res.json(userData)
    } catch (e) {
        next(e)
    }
}


module.exports = {
    registration,
    activate,
    login,
    logout,
    refresh
}
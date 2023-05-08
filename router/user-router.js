const express = require('express');

const {
    registration,
    activate,
    login,
    logout,
    refresh,
} = require('../controllers/user-controller')

const {getSession} = require('../controllers/session-controller')


const router = express.Router();
const {body} = require('express-validator')
const authMiddleware = require('../middleware/auth-middleware');


router.post('/registration',
    body('username').isLength({min: 3}),
    body('email').isEmail(),
    body('password').isLength({min: 6, max: 32}),
    registration)
router.get('/activate/:link', activate)
router.post('/login', login)
router.post('/logout', logout)
router.get('/refresh', refresh)

router.get('/sessions/:link', getSession)


module.exports = router;
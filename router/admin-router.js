const express = require('express');


const router = express.Router();
const {body} = require('express-validator')
const authMiddleware = require('../middleware/auth-middleware');
const {getAllQuiz, getOneQuiz, addQuiz, deleteQuiz, updateQuiz} = require("../controllers/quiz-controller");
const {getAllPolls, getOnePoll,addPoll, deletePoll, updatePoll} = require("../controllers/poll-controller");
const {getAllPrograms} = require('../controllers/program-controller')
const {getSession, createSession, addEvent} = require("../controllers/session-controller");

router.get('/quiz', getAllQuiz)
router.get('/quiz/:id', getOneQuiz)
router.post('/quiz', addQuiz )
router.delete('/quiz/:id', deleteQuiz)
router.patch('/quiz/:id', updateQuiz)

router.get('/polls', getAllPolls)
router.get('/polls/:id', getOnePoll)
router.post('/polls', addPoll )
router.delete('/polls/:id', deletePoll)
router.patch('/polls/:id', updatePoll)

router.get('/programs', getAllPrograms)

router.post('/sessions', createSession)
router.patch('/sessions/:link', addEvent)

module.exports = router;
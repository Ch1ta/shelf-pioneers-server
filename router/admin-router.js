const express = require('express');


const router = express.Router();
const {body} = require('express-validator')
const authMiddleware = require('../middleware/auth-middleware');
const {getAllQuiz, getOneQuiz, addQuiz, deleteQuiz, updateQuiz} = require("../controllers/quiz-controller");
const {getAllPolls, getOnePoll, addPoll, deletePoll, updatePoll} = require("../controllers/poll-controller");
const {getAllPrograms} = require('../controllers/program-controller')
const {
    getAllSessions,
    getQuizEventStats,
    getOneSession,
    getOpenSessions,
    createSession,
    closeSession,
    setCurrentEvent,
    getCurrentEventStats,
    closeCurrentEvent,
    getAllEvents,
    getEvent,
    addEventAnswer
} = require("../controllers/session-controller");

router.get('/quiz', getAllQuiz)
router.get('/quiz/:id', getOneQuiz)
router.post('/quiz', addQuiz)
router.delete('/quiz/:id', deleteQuiz)
router.patch('/quiz/:id', updateQuiz)

router.get('/polls', getAllPolls)
router.get('/polls/:id', getOnePoll)
router.post('/polls', addPoll)
router.delete('/polls/:id', deletePoll)
router.patch('/polls/:id', updatePoll)

router.get('/programs', getAllPrograms)

router.post('/sessions', createSession)
router.get('/sessions', getAllSessions)
router.get('/sessions/:link', getOneSession)
router.patch('/sessions/:link/close', closeSession)
router.patch('/sessions/:link/current-event', setCurrentEvent)
router.delete('/sessions/:link/current-event', closeCurrentEvent)
router.get('/opened-sessions', getOpenSessions)

router.get('/events', getAllEvents)
router.get('/events/:id', getEvent)
router.get('/events/:id/stats', getQuizEventStats)
router.patch('/events/:id', addEventAnswer)

module.exports = router;
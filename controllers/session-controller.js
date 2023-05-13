const shortid = require('shortid');
const qs = require('querystring');

const Session = require('../models/session');
const Event = require('../models/event');
const Quiz = require('../models/quiz');
const Poll = require('../models/poll');

const {ObjectId} = require("mongodb");

const handleError = (res, err) => {
    console.log(err)
    res.status(500).json({error: err})
}

async function generateUniqueLink() {
    const characters = '0123456789';
    let link = '';
    let isUnique = false;
    while (!isUnique) {
        link = '';
        for (let i = 0; i <= 5; i++) {
            link += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const sessions = await Session.find({}, {link: 1, _id: 0});
        isUnique = !sessions.some((session) => session.link === link);
    }
    return link;
}

const getAllSessions = async (req, res) => {
    try {
        const {isOpen} = req.query

        const sessions = await Session.find()

        if (isOpen === 'true') {
            const openSessions = sessions.filter(session => session.isOpen == true)
            return res.status(200).json(openSessions)
        }
        if (isOpen === 'false') {
            const closedSessions = sessions.filter(session => session.isOpen == false)
            return res.status(200).json(closedSessions)
        }

        res.status(200).json(sessions)

    } catch (err) {
        handleError(res, err)
    }
}
const getOneSession = async (req, res) => {
    try {
        const {link} = req.params;
        const session = await Session.findOne({link});
        res.status(200).json(session);
    } catch (err) {
        handleError(res, err)
    }
}

const getOpenSessions = async (req, res) => {
    try {
        const result = await Session.find({isOpen: true});
        return res.status(200).json(result)
    } catch (err) {
        handleError(res, err)
    }
}


const createSession = async (req, res) => {
    try {
        const link = await generateUniqueLink();

        const session = new Session({link, openTime: Date.now()});
        const result = await session.save()
        res.status(201).json(result)

    } catch (err) {
        handleError(res, err)
    }
}

const closeSession = async (req, res) => {
    try {
        const {link} = req.params;
        await Session.findOneAndUpdate(
            {link: link},
            {$set: {isOpen: false}},
            {new: true}
        );

        res.status(201).json({success: true});

    } catch (err) {
        handleError(res, err)
    }
}


//for user
const getCurrentEvent = async (req, res) => {
    try {
        const userId = new ObjectId('6453497a433e98e52cbb8725');

        const session = await Session.findOne({link: req.params.link});
        if (!session) return res.status(404).json({message: 'Сессия не найдена'});

        const eventId = session.currentEvent;
        if (!eventId) return res.status(204).json({message: 'No current event set'});


        const currentEvent = await Event.findById(eventId);
        if (!currentEvent) return res.status(404).json({message: 'Event not found'})

        const userResults = currentEvent.results.find(result => result.user.equals(userId));
        console.log(userResults)

        if (userResults) {
            if (userResults.finished) return res.status(204).json({message: 'You have already finished'})
        } else await Event.findOneAndUpdate(
            {_id: eventId},
            {
                $addToSet: {results: {user: userId, answers: []}},
                $inc: {joinedCount: 1}
            },
            {new: true}
        )


        const ref = new ObjectId(currentEvent.ref);

        if (currentEvent.type === "Quiz") {
            const quiz = await Quiz.findById(ref);
            const {_id, title, questions, timer} = quiz;
            const questionsWithoutAnswers = questions.map(q => ({
                question: q.question,
                variants: q.answers
            }));
            res.status(200).json({type: currentEvent.type, eventId, title, questions: questionsWithoutAnswers, timer})
        }
        if (currentEvent.type === "Poll") {
            const poll = await Poll.findById(ref);
            const {_id, title} = poll;
            const questions = poll.questions;
            console.log(poll)
            res.status(200).json({type: currentEvent.type, eventId, title, questions})
        }

    } catch (e) {
        handleError(res, e)
    }
}

//for admin
const getAllEvents = async (req, res) => {
    try {
        const result = await Event.find();
        res.status(200).json(result);
    } catch (err) {
        handleError(res, err)
    }
}

const getEvent = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await Event.findById(new ObjectId(id));
        res.status(200).json(result);
    } catch (err) {
        handleError(res, err)
    }
}

const getQuizEventStats = async (req, res) => {
    try {
        const {id} = req.params;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({message: 'Event not found'})

        if (event.type === 'Quiz') {
            const {type, joinedCount, finishedCount, results} = event;

            const quiz = await Quiz.findById(event.ref)


            const arr = quiz.questions.map(item => ({question: item.question, totalAnswers: 0, correctAnswers: 0}))

            const correctAnswers = quiz.questions.map(item => item.correctIndex)

            correctAnswers.forEach((item, index) => {
                event.results.forEach(result => {
                    arr[index].totalAnswers += 1;
                    if (result.answers[index] == item) arr[index].correctAnswers += 1;
                })
            })

            return res.status(200).json({type, title: quiz.title, joinedCount, finishedCount, questions: arr})
        }

        if (event.type === 'Poll') {

            const poll = await Poll.findById(event.ref)

            const {type, joinedCount, finishedCount, results} = event;


            return res.status(200).json({type, title: poll.title, joinedCount, finishedCount, questions:poll.questions})
        }

    } catch (err) {
        handleError(res, err)
    }

}
const setCurrentEvent = async (req, res) => {
    try {
        const {link} = req.params;

        const {type, id, timer} = req.body;
        const ref = new ObjectId(id);

        const event = new Event({type, ref, timer})
        await event.save();

        const session = await Session.findOne({link});
        session.currentEvent = new ObjectId(event._id);
        await session.save();

        res.status(201).json(session)

    } catch (err) {
        handleError(res, err)
    }

}

const closeCurrentEvent = async (req, res) => {
    try {
        const {link} = req.params;

        const session = await Session.findOne({link});
        if (!session) return res.status(404).json({message: 'Session not found'})

        const currentEventId = session.currentEvent


        const updatedEvent = await Event.findOneAndUpdate(
            {_id: currentEventId},
            {$set: {isOpen: false}},
            {new: true}
        );

        session.currentEvent = null;
        session.history.push(currentEventId);
        await session.save()

        return res.status(200).json(session)


    } catch (err) {
        handleError(res, err)
    }
}

const addEventAnswer = async (req, res) => {
    try {
        const userId = '6453497a433e98e52cbb8725';
        const eventId = req.params.id;
        const answerIndex = req.body.index;
        const answer = req.body.answer.toString();

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({message: 'Event not found'})

        const resultIndex = event.results.findIndex(result => result.user.equals(userId));
        event.results[resultIndex].answers[answerIndex] = answer;
        if (event.results[resultIndex].answers.length === answerIndex + 1) {
            event.results[resultIndex].finished = true;
        }
        await event.save();

        res.status(200).json({success: true})

    } catch (err) {
        handleError(res, err)
    }
}

module.exports = {
    getAllSessions,
    getOneSession,
    getOpenSessions,

    getAllEvents,
    getEvent,
    getCurrentEvent,
    getQuizEventStats,
    addEventAnswer,

    createSession,
    closeSession,
    setCurrentEvent,
    closeCurrentEvent
}
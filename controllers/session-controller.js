const shortid = require('shortid');

const Session = require('../models/session');
const Quiz = require('../models/quiz');
const Poll = require('../models/poll');

const {ObjectId} = require("mongodb");

const handleError = (res, err) => {
    console.log(err)
    res.status(500).json({error: err})
}
const getSession = async (req, res) => {
    try {
        const session = await Session.findOne({link: req.params.link});
        if (!session) {
            return res.status(404).send('Session not found');
        }
        const userId = new ObjectId('6453497a433e98e52cbb8726');

        session.users.push(userId);
        session.userCount++;
        await session.save();

        res.status(200).json({message: 'added to session'})


    } catch (e) {
        handleError(res, e)
    }
}

const createSession = async (req, res) => {
    try {
        const link = shortid.generate();
        const session = new Session({link});
        const result = await session.save()
        res.status(201).json(result)

    } catch (err) {
        handleError(res, err)
    }
}

addEvent = async (req, res) => {
    try {
        const link = req.params.link;
        const type = req.body.type;
        const id = new ObjectId(req.body.id);

        const session = await Session.findOne({link: link});

        session.events.push({type, ref: id});
        await session.save();

        res.status(201).json({succes: true})

    } catch (e) {
        handleError(res, e)
    }

}


module.exports = {
    getSession,
    createSession,
    addEvent
}
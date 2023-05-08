const Poll = require('../models/poll');
const handleError = (res, err) => {
    console.log(err)
    res.status(500).json({error: err})
}

const getAllPolls = (req, res) => {
    try {
        Poll
            .find()
            .then((items) => {
                res
                    .status(200)
                    .json(items);
            })
    } catch (err) {
        handleError(res, err)
    }
}
const getOnePoll = async(req, res) => {
    try {
        const pollId = req.params.id
        const result = await Poll.findById(pollId)

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({success: false, message: 'Опрос не найден'});
        }
    } catch (err) {
        handleError(res,'Неверный id')
    }
}
const addPoll = async(req, res) => {
    try {
        const titleCandidate = await Poll.findOne({title:req.body.title});
        if (!titleCandidate) {
            const poll = new Poll({...req.body});
            const result = await poll.save()
            res.status(201).json(result)
        } else {
            res.status(409).json({message: 'Название занято'})
        }
    } catch (err) {
        handleError(res, err)
    }
}
const deletePoll = async (req, res) => {
    try {
        const pollId = req.params.id;
        const result = await Poll.findByIdAndDelete(pollId)
        if (result) {
            res.status(200).json({message: 'Опрос успешно удален'});
        } else {
            res.status(404).json({success: false, message: 'Опрос не найден'});
        }
    } catch (err) {
        handleError(res, err)
    }

}
const updatePoll = async (req, res) => {
    try {
        const pollId = req.params.id;
        const updatedPoll = req.body;
        const options = {new: true}

        const result = await Poll.findByIdAndUpdate(pollId, updatedPoll, options);

        if (result) {
            res.status(200).json({ message: 'Опрос успешно обновлен'});
        } else {
            res.status(404).json({message: 'Опрос не найден'});
        }
    } catch (err) {
        handleError(res, err)
    }
}


module.exports = {
    getAllPolls,
    getOnePoll,
    addPoll,
    deletePoll,
    updatePoll
}
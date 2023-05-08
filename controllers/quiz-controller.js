const Quiz = require('../models/quiz');
const handleError = (res, err) => {
    console.log(err)
    res.status(500).json({error: err})
}

const getAllQuiz = (req, res) => {
    try {
        Quiz
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
const getOneQuiz = async(req, res) => {
    try {
        const quizId = req.params.id
        const result = await Quiz.findById(quizId)

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({success: false, message: 'Квиз не найден'});
        }
    } catch (err) {
        handleError(res,'Неверный id')
    }
}
const addQuiz = async(req, res) => {
    try {
        const titleCandidate = await Quiz.findOne({title:req.body.title});
        if (!titleCandidate) {
            const quiz = new Quiz({...req.body});
            const result = await quiz.save()
            res.status(201).json(result)
        } else {
            res.status(409).json({message: 'Название занято'})
        }
    } catch (err) {
        handleError(res, err)
    }
}
const deleteQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const result = await Quiz.findByIdAndDelete(quizId)
        if (result) {
            res.status(200).json({message: 'Квиз успешно удален'});
        } else {
            res.status(404).json({success: false, message: 'Квиз не найден'});
        }
    } catch (err) {
        handleError(res, err)
    }

}
const updateQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const updatedQuiz = req.body;
        const options = {new: true}

        const result = await Quiz.findByIdAndUpdate(quizId, updatedQuiz, options);

        if (result) {
            res.status(200).json({ message: 'Объект успешно обновлен'});
        } else {
            res.status(404).json({message: 'Объект не найден'});
        }
    } catch (err) {
        handleError(res, err)
    }
}


module.exports = {
    getAllQuiz,
    getOneQuiz,
    addQuiz,
    deleteQuiz,
    updateQuiz,
}
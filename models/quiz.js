const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    questions: {
        type: [{
            question: {type: String, required: true},
            answers: [String],
            correctIndex: {type: Number,required:true}
        }], default: []
    },
    timer: {type: Number, default: 15}
}, { collection: 'quiz' })


const Quiz = mongoose.model('Quiz', schema);

module.exports = Quiz;
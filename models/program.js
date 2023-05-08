const mongoose = require('mongoose')

const ProgramSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String},
    items: [{
        type: {
            type: String,
            enum: ['quiz', 'game']
        },
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz1'
        },
        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game'
        }
    }]
})



const Program = mongoose.model('Program', ProgramSchema);

module.exports = Program;
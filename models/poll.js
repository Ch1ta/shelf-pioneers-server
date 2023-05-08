const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    questions: [String],
}, { collection: 'polls' })


const Poll = mongoose.model('Poll', schema);

module.exports = Poll;
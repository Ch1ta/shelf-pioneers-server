const {Schema, model} = require('mongoose')

const schema = new Schema({
    isOpen: {type: Boolean, default: true},
    joinedCount: {type:Number, default: 0},
    finishedCount:{type:Number, default: 0},
    type: {
        type: String,
        required: true,
        enum: ['Quiz', 'Poll'],
    },
    ref: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'events.type',
    },
    results: [
        {
            user: {type: Schema.Types.ObjectId, ref: 'User'},
            finished: {type:Boolean, default: false},
            answers: [{type: String}],
        }
    ],
    questionTimer: {type:Number}
})

module.exports = model('Event', schema);
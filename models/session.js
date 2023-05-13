const {Schema, model} = require('mongoose')

const SessionSchema = new Schema({
    link: {type: String, unique: true, required: true},
    isOpen: {type: Boolean, default: true},
    openTime:{type:Date},
    closeTime:{type:Date},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    currentEvent: {type: Schema.Types.ObjectId, ref: 'Event'},

    history: [
        {
            type:Schema.Types.ObjectId, ref: 'Event'
        }
    ],

})

module.exports = model('Session', SessionSchema)
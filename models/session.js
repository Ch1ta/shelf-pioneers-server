const {Schema, model} = require('mongoose')

const SessionSchema = new Schema({
    link: { type: String, unique: true, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    userCount: {type: Number, default:0},
    events: [
        {
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
        },
    ],
    active: {type: Boolean, default: true}
})

module.exports = model('Session', SessionSchema)
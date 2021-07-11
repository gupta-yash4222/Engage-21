const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        rooms: {type: String}
    },
    { collection: 'Users'}
)

const model = mongoose.model('UserModel', UserSchema)

module.exports = model
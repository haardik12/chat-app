const mongoose = require('mongoose');

async function connectDb () {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log('Connected to MongoDB')
        })

        connection.on('error', (error) => {
            console.log('soemthing wrong with db ' + error)
        })
    } catch (error) {
        console.log('something is wrong ' + error)
    }
}

module.exports = connectDb
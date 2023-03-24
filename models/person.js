const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
const url = process.env.MONGODB_URI

console.log("Connecting to database...")
mongoose.connect(url)
    .then(result => {
        console.log("Connected to Mongo server")
    })
    .catch((error) => {
        console.log(`Error: ${error}`)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: [true, "Name required"],
        validate: {
            validator: (v) => {
                return v.length >= 3
            },
            message: props => `Name '${props.value}' needs to be at least three characters long`
        }
    },
    number: {
        type: String,
        minLength: 8,
        required: [true, "Number required"],
        validate: {
            validator: (v) => {
                return /^\d{8,}$/.test(v) || /^(\d{2,3}-)?\d{5,}$/.test(v) 
            },
            message: props => `Number needs to be at least 8 digits with formats XXXXXXXX, XX-XXXXXX or XXX-XXXXX`
        }
    },
    id: Number
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log(
        'To view entries: node mongo.js <password>',
        '\nTo add a number: node mongo.js <password> <name> <number>'
    )
    process.exit(1)
}

// saving arguments
const password = process.argv[2]
const nameArg = process.argv[3]
const numArg = process.argv[4]

const url = `mongodb+srv://admin:${password}@ajetpractice.lxwm1uv.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})

async function run() {
    console.log("Connecting to database...")
    await mongoose.connect(url)
    const Person = mongoose.model('Person', personSchema)

    if(nameArg && numArg){
        const person = new Person({
            name: `${nameArg}`,
            number: `${numArg}`
        })
        person.save().then(result => {
            console.log(`added ${person.name} number ${person.number} to phonebook`)
            mongoose.connection.close()
        })
    } else {
        console.log("phonebook:")
        Person.find({})
        .then(persons => {
            // console.log(persons)
            persons.map(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
    }
}

run()

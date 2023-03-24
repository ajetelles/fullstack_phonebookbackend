//const { response } = require('express')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const { default: mongoose } = require('mongoose')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('requestdata', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestdata', 
{ stream: process.stdout }))

// let persons = [
//     {
//       "name": "Arto Hellas",
//       "number": "040-123456",
//       "id": 1
//     },
//     {
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523",
//       "id": 2
//     },
//     {
//       "name": "Dan Abramov",
//       "number": "12-43-234345",
//       "id": 3
//     },
//     {
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122",
//       "id": 4
//     },
//     {
//       "name": "asdasd",
//       "number": "231123",
//       "id": 5
//     }
//   ]

// get localhost:3001/info
app.get('/info', (request, response) => {
    let timestamp = new Date().toISOString()
    Person.find({})
        .then(persons => {
            response.send(`<p>Phonebook has info for ${persons.length} people <br/> ${timestamp}</p>`)
        })
})

// get localhost:3001/api/persons
app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        // mongoose.connection.close()
    // response.json(persons)
})

// get localhost:3001/api/persons/id
app.get('/api/persons/:id', (request,response) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
    // const id = Number(request.params.id)
    // console.log(id)
    // const person = persons.find(p => p.id === id)
    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
})

// post 
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number is missing'
        })
    } //else if(Person.exists({name: body.name}) || Person.exists({name: body.number})) {
    //else if  (persons.some(person => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: 'Name already exists in phonebook'
    //     })
    // }

    const newperson = new Person ({
        name: body.name,
        number: body.number,
        // id: Math.floor(Math.random() * 500),
    })
    // Person.find({})
    //     .then(persons => {
    //         if (persons.some(person => person.name === body.name)) {

    //         }
    //     })
    newperson.save()
        .then(savedPerson => {
            console.log("didnt catch error!")
            response.json(savedPerson)
            mongoose.connection.close()
        })
        .catch((error) => {
            console.log("entered error catching function")
            console.log(`error is ${error}`)
            next(error)
        })
    // persons = persons.concat(person)
    // response.json(person)
})

//put localhost:3001/api/persons/id; if name/number exists
app.put('/api/persons/:id', (request, response) => {
    Person.updateOne(request.params.id , request.body)
    Person.findById(request.params.id)
        .then(result => {
            response.status(200).json(result)
        })
        .catch((error) => {
            console.log("entered error catching function")
            console.log(`error is ${error}`)
            next(error)
        })
    // const { id } = request.params.id
    // await Person.updateOne({ id }, request.body)
    // const updatedPerson = await Person.findById(request.params.id)
    // return response.status(200).json(updatedPerson)
})

// delete localhost:3001/api/persons/id
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)
    // response.status(204).end()
})

// dev part
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

// // build
// const PORT = process.env.PORT || 8080
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`)
// })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log("entered error handler!")
    console.error(error.message)
    console.log(error.name)
    if (error.name === 'CastError') {
        return response.status(400).send({  
            error: 'malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        console.log("detected validation error")
        return response.status(400).json({
            error: error.message
        })
    }
    next(error)
}
app.use(errorHandler)
//const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('requestdata', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestdata', 
{ stream: process.stdout }))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "asdasd",
      "number": "231123",
      "id": 5
    }
  ]

// get localhost:3001/info
app.get('/info', (request, response) => {
    let timestamp = new Date().toISOString()
    response.send(`<p>Phonebook has info for ${persons.length} people <br/> ${timestamp}</p>`)
})

// get localhost:3001/api/persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// get localhost:3001/api/persons/id
app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// post 
app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number is missing'
        })
    } else if  (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Name already exists in phonebook'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 500),
    }
    persons = persons.concat(person)
    response.json(person)
})

// delete localhost:3001/api/persons/id
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

// // dev part
// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)

// build
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
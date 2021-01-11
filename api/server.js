// write the server here and export it
const express = require('express') // CommonJS
// import express from 'express'
const Dog = require('./dog-model')
const server = express() // instantiates an express app

server.use(express.json()) // configures the app to read the body of requests

// build a simple endpoint
// [GET] /
server.get('/', (req, res) => {
  res.json({ message: 'hello world' })
})

server.get('/api/dogs', (req, res) => {
  // 1- pull info from request (and validate it)
  Dog.findAll()
    // 2- interact with the database
    .then(dogs => {
      // 3- send the client appropriate response
      res.status(200).json(dogs)
    })
    .catch(error => {
      res.status(500).json({ message: error.message })
    })
})

server.get('/api/dogs/:id', (req, res) => {
  // 1- pull info from request
  const { id } = req.params
  // 2- interact with the database
  Dog.findById(id)
    .then(dog => {
      // 3- send the client appropriate response
      if (!dog) {
        res.status(404).json({ message: `dog with id ${id} not found` })
      } else {
        res.status(200).json(dog)
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message })
    })
})

server.post('/api/dogs', async (req, res) => {
  // 1- pull info from request and validating a bit
  const dog = req.body
  if (!dog.name || !dog.weight) {
    res.status(400).json({ message: 'name and weight are required' })
  } else {
    // 2- interact with the database
    try {
      const newlyCreated = await Dog.create(dog)
      // 3- send the client appropriate response
      res.status(201).json(newlyCreated)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
})

server.put('/api/dogs/:id', async (req, res) => {
  // 1- pull info from request and validating a bit
  const id = req.params.id
  const changes = req.body
  if (!changes.name || !changes.weight || changes.adopter_id === undefined) {
    res.status(400).json({ message: 'all fields are required' })
  } else {
    try {
      // 2- interact with the database
      const updated = await Dog.update(id, changes)
      if (!updated) {
        // 3- send the client appropriate response
        res.status(404).json({ message: `dog with id ${id} not found` })
      } else {
        res.status(200).json(updated)
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
})
-
server.delete('/api/dogs/:id', (req, res) => {
  const { id } = req.params
  Dog.delete(id)
    .then(deleted => {
      if (!deleted) {
        res.status(404).json({ message: `dog with id ${id} not found` })
      } else {
        res.status(200).json(deleted)
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message })
    })
})

// export this server so index.js can get it
module.exports = server  // CommonJS syntax
// export default server // ES6 native modules syntax

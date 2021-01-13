// write the server here and export it
const { SERVFAIL } = require('dns');
const Dog = require('./dog-model');
// Dog.create({name: "something", weight: "25"})
const express = require('express');
const { json } = require('body-parser');
const server = express();

server.use(express.json());

// HTTP METHOD, PATH

// GET /
server.get('/', (req, res) => {
    res.send("hello!")
});

// GET /hello
server.get('/hello', (req, res) => {
    res.send("greetings from /hello")
});

server.post('/api/dogs', async (req, res) => {
    const dog = req.body;

    if(!dog.name || !dog.weight) {
        res.status(400).json({ message: "must include name and weight"})
    }

    try {
        const newlyCreatedDog = await Dog.create(dog)
        console.log(newlyCreatedDog);
        res.status(200).json(newlyCreatedDog)
    } catch(err) {
        res.status(500).json({ error: err.message})
    }
});

//  EITHER OR

// server.post('/api/dogs', (req, res) => {
//     const dog = res.body;
//     Dog.create(dog)
//         .then(newlyCreatedDog => {
//             res.status(200).json(newlyCreatedDog)
//         })
//         .catch(err => {
//             res.status(500).json({error:err.message})
//         })
// })

server.get('/api/dogs', async (req, res) => {
    try {
        const dogs = await Dog.findAll();
        res.status(200).json(dogs);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
});

server.delete('/api/dogs/:id', async (req, res) => {
    const id = req.params.id;
    // EITHER OR
    // const {id} = req.params;

    try {
        const dog = await Dog.delete(id);
        if (dog) {
            res.status(200).json(dog);
        } else {
            res.status(404).json({message: "unknown id"});
        }
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

server.put('/api/dogs/:id', async (req, res) => {
    const id = req.params.id;
    const changes = req.body

    if (!changes.name || !changes.weight) {
        res.status(400).json({ message: 'must include name and weight' });
    } else {
        try {
            const updatedDog = await Dog.update(id, changes);
            if (updatedDog) {
                res.status(200).json(updatedDog)
            } else {
                res.status(404).json({ message: 'unkown id' })
            }
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
});

module.exports = server;
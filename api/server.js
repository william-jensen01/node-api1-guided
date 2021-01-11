// write the server here and export it
const express = require('express') // CommonJS
// import express from 'express'

const server = express() // instantiates an express app

server.use(express.json()) // configures the app to read the body of requests

// build a simple endpoint
// [GET] /
server.get('/')

const express = require('express')
const app = express.Router()
const users = require('./users')
const checkAuth = require('./middleware/check-auth')


app.get('/users/:id', users.get)
app.get('/users/', users.getAll)
app.post('/users/signin', users.signin)
app.post('/users/signup', users.signup)
app.patch('/users/:id', checkAuth, users.update)

app.post('/users/contactus', users.contactUs)

module.exports = app
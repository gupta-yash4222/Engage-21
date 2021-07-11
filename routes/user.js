const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user')

console.log("User model => ", User) 

JWT_SECRET = "$||Engage||$"

const authorization = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
      return res.sendStatus(403)
    }
    try {
      const data = jwt.verify(token, JWT_SECRET)
      req.id = data.id
      req.email = data.email
      return next()
    } catch(error) {
      return res.sendStatus(403)
    }
}

router.get('/signup', (req, res) => {
    res.render('../views/signup.ejs')
})

router.get('/login', (req, res) => {
    res.render('../views/login.ejs')
})

router.post('/signup', async (req, res) => {
    //console.log(req.body)

    const { name, email, password: plainTextPassword } = req.body
    const password = await bcrypt.hash(plainTextPassword, 10)
    const rooms = ""

    console.log(User)

    if(!name || typeof name !== 'string') {
        return res.json({ status: 'error', error: 'Invalid Name'} )
    }

    if(!email || typeof email !== 'string'){
        return res.json({ status: 'error', error: 'Invalid email address' })
    }

    if(!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password'})
    }

    if(plainTextPassword.length < 6) {
        return res.json({ status: 'error', error: 'Password too small. Should be at least 6 characters long'})
    }

    try {
        const response = await User.create({
            name,
            email,
            password,
            rooms
        })
        console.log(response)

    } catch (error) {
        console.log(JSON.stringify(error))
        if(error.code === 11000){
            // duplicate email
            return res.json({status: 'error', error: 'Email already registered'})
        }
        throw error
    }

    res.json({status: 'ok'})
})

router.post('/login', async (req, res) => {
    console.log(req.body)

    const { email, password } = req.body
    const user = await User.findOne({ email }).lean()

    if(!user) {
        return res.json({ status: 'error', error: 'Email not registered'})
    }

    if(await bcrypt.compare(password, user.password)) {

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            JWT_SECRET
        )

        //return res.json({ status: 'ok', data: token})

        return res
                .cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                })
                .status(200)
                .json({ status: 'ok'})
                
    }

    return res.json({ status: 'error', error: 'Incorrect password'})
})

router.get('/user', authorization, (req, res) => {
    return res.json({ user: { id: req.id, email: req.email }})
})

router.post('/changePassword', async (req, res) => {
    
})

module.exports = router
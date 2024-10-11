const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const passport = require('passport')
const router = new express.Router()
const { sendResetPasswordEmail } = require('../emails/account')

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})

    }catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        //generating token for a particular user
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send('Wrong Credentials!')
    }
})

//forgot password
router.post('/users/forgot-password', async (req, res) => {
    try{
        const user = await User.findOne({ email : req.body.email})
        
        if (!user){
            return res.status(404).send('User Not Found!')
        }
        const token = await user.generateAuthToken('10m')
        sendResetPasswordEmail(user.email, user.name, token)
        
        res.send({ user, token})
    }catch(e){
        res.status(500).send('Enter Valid ID')
    }
})

//logout the cuurent user
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send()
    }
}) 

//logout from all devices of the authenticated user
router.post('/users/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)

    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/user/me', auth, async (req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password']
    const isValidOperation = updates.every( (update) => allowedUpdates.includes(update))

    if (!isValidOperation){
        return res.status(400).send({ 'Error' : 'Invalid updates!'})
    }

    try{
        
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
        
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/user/me', auth, async (req, res) =>{
    try{ 
        await req.user.deleteOne()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })); // we are requesting profile and email of user from google
  
router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/authentication-failed' }),
    async (req, res) => {
        const token = await req.user.generateAuthToken();

        res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    });

module.exports = router
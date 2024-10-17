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
        if (e.errors){
            if ( e.errors.password ) {
                return res.status(400).send(e.errors.password.message);
            }
            if (e.errors.email) {
                return res.status(400).send(e.errors.email.message);
            }
        }
        res.status(400).send('All fields are mandatory!')
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
        const email = req.body.email
        if (!email){
            return res.status(404).send('Enter Valid ID')
        }
        const user = await User.findOne({ email})
        
        if (!user){
            return res.status(404).send('User Not Found!')
        }
        const token = await user.generateAuthToken('10m')
        sendResetPasswordEmail(user.email, user.name, token)
        
        res.send({ user, token})
    }catch(e){
        res.status(500).send('Some error occurred!')
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
        res.status(500).send('Could not logout, Some error occurred!')
    }
}) 

//logout from all devices of the authenticated user
router.post('/users/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)

    }catch(e){
        res.status(500).send('Could not logout, Some error occurred!')
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/user/me', auth, async (req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every( (update) => allowedUpdates.includes(update))

    if (!isValidOperation){
        return res.status(400).send({ 'Error' : 'Invalid updates!'})
    }

    try{
        
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
        
    }catch(e){
        if (e.errors && e.errors.password) {
            return res.status(400).send(e.errors.password.message); 
        }
        res.status(400).send('Could not update user. Check if all fields are filled and retry.')
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
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/authentication-failed` }),
    async (req, res) => {
        const token = await req.user.generateAuthToken();

        res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
    });

module.exports = router
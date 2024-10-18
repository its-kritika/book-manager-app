const express = require('express')
const Book = require('../models/book')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/books', auth, async (req, res) => {
    const book = new Book({
        ...req.body,
        owner : req.user._id
    })
    try{
        await book.save()
        res.status(201).send(book)
    }catch(e){
        res.status(400).send('All fields are mandatory!')
    }
})

router.get('/books', auth, async (req, res) =>{
    try{
        const books = await Book.find({ owner : req.user._id})
        res.send(books)
    }catch(e){
        res.status(500).send('Could not fetch books!')
    }
})

router.get('/book/:id', auth, async (req, res) => {

    const _id = req.params.id

    try{
        const book = await Book.findOne({_id, owner : req.user._id})
        if (!book){
            return res.status(404).send()
        }
        res.send(book)
    }catch(e){
        res.status(500).send()
    }
  
})

router.patch('/book/:id', auth, async (req, res) =>{
    try{ 
        const book = await Book.findOneAndUpdate({ _id: req.params.id, owner: req.user._id },
            req.body,{ new: true, runValidators: true })

        if (!book){
            return res.status(404).send()  
        }
        res.send(book)
    }catch(e){
        res.status(500).send('Could not update book. Check if all fields are filled and retry.')
    }
})

router.delete('/book/:id', auth, async (req, res) =>{
    try{ 
        const book = await Book.findOneAndDelete({_id: req.params.id, owner : req.user._id})
        if (!book){
            return res.status(404).send()
        }
        res.send(book)
    }catch(e){
        res.status(500).send('Book not found!')
    }
})

module.exports = router
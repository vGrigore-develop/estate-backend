const express = require('express')
const router = express.Router()

const authMiddleware = require('../../middleware/auth')

const Estate = require('./model')

router.post('/create', authMiddleware, async (req, res) => {
  const data = new Estate({
    title: req.body.title,
    price: req.body.price,
    phone: req.body.phone,
    rooms: req.body.rooms,
    location: req.body.location,
    city: req.body.city,
    source: req.body.source,
  })

  try {
    const dataToSave = await data.save()
    res.status(200).json(dataToSave)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/get', authMiddleware, async (req, res) => {
  try {
    const data = await Estate.find()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/get/:id', authMiddleware, async (req, res) => {
  try {
    const data = await Estate.findById(req.params.id)
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/update/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id
    const updatedData = req.body
    const options = { new: true }

    const result = await Estate.findByIdAndUpdate(id, updatedData, options)

    res.send(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const id = req.params.id
    const data = await Estate.findByIdAndDelete(id)

    res.send(`Estate ${data.name} has been deleted`)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router

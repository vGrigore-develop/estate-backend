const express = require('express')
const router = express.Router()

const Model = require('./model')

router.post('/create', async (req, res) => {
  const data = new Model({
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

router.get('/get', async (req, res) => {
  try {
    const data = await Model.find()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/get/:id', async (req, res) => {
  try {
    const data = await Model.findById(req.params.id)
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id
    const updatedData = req.body
    const options = { new: true }

    const result = await Model.findByIdAndUpdate(id, updatedData, options)

    res.send(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id
    const data = await Model.findByIdAndDelete(id)

    res.send(`Estate ${data.name} has been deleted`)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router

const express = require('express')
const router = express.Router()

const authMiddleware = require('../../middleware/auth')
const adminAuthMiddleware = require('../../middleware/adminAuth')

const Estate = require('./model')

router.get('/get', authMiddleware, async (req, res) => {
  const { pageSize, pageNo, ...searchParams } = req.query
  try {
    const estates = await Estate.find(searchParams)
      .limit(pageSize * 1)
      .skip((pageNo - 1) * pageSize)
      .sort({ updatedAt: -1 })
    const count = await Estate.countDocuments()

    res.status(200).json({
      estates,
      pagination: {
        totalPages: Math.ceil(count / pageSize),
        currentPage: pageNo,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/get/:id', authMiddleware, async (req, res) => {
  try {
    const estates = await Estate.findById(req.params.id)
    res.json({
      estates,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/create', adminAuthMiddleware, async (req, res) => {
  const { title, price, phone, rooms, location, city, source } = req.body

  const data = new Estate({
    title,
    price,
    phone,
    rooms,
    location,
    city,
    source,
  })

  try {
    const dataToSave = await data.save()
    res.status(200).json(dataToSave)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.patch('/update/:id', adminAuthMiddleware, async (req, res) => {
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

router.delete('/delete/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const id = req.params.id
    const data = await Estate.findByIdAndDelete(id)

    res.send({ message: `Estate ${data.name} has been deleted` })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router

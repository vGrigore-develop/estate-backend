const express = require('express')
const router = express.Router()

const logger = require('../../config/logger')
const authMiddleware = require('../../middleware/auth')
const adminAuthMiddleware = require('../../middleware/adminAuth')

const Estate = require('./model')

router.get('/get', authMiddleware, async (req, res) => {
  const { pageSize, pageNo, sortField, sortOrder, ...searchParams } = req.query

  let sortQuery = {}
  if (sortField) {
    sortQuery[sortField] = sortOrder === 'asc' ? 1 : -1
  }

  try {
    const estates = await Estate.find(searchParams)
      .limit(pageSize * 1)
      .skip((pageNo - 1) * pageSize)
      .sort(sortQuery);
    const count = await Estate.countDocuments()

    logger.info(
      `User fetched estates with params: ${JSON.stringify(searchParams)}`,
      { module: 'EstateListing' }
    )

    res.status(200).json({
      estates,
      pagination: {
        totalPages: Math.ceil(count / pageSize),
        currentPage: pageNo,
      },
    })
  } catch (error) {
    logger.error(
      `Error fetching estates with params: ${JSON.stringify(searchParams)} - ${
        error.message
      }`,
      { module: 'EstateListing' }
    )
    res.status(500).json({ message: error.message })
  }
})

router.get('/get/:id', authMiddleware, async (req, res) => {
  try {
    const estates = await Estate.findById(req.params.id)

    logger.info(`Fetching estate with ID: ${req.params.id}`, {
      module: 'EstateRetrievalByID',
    })
    res.json({
      estates,
    })
  } catch (error) {
    logger.error(
      `Error fetching estate with ID: ${req.params.id} - ${error.message}`,
      { module: 'EstateRetrievalByID' }
    )
    res.status(500).json({ message: error.message })
  }
})

router.post('/favorite/:id', authMiddleware, async (req, res) => {
  const user_id = req.user.user_id

  try {
    const updateResponse = await Estate.updateOne(
      { _id: req.params.id },
      { $addToSet: { favorites: user_id } }
    )

    logger.info(`User ${user_id} added estate ${req.params.id} to favorites`, {
      module: 'EstateFavorites',
    })
    res.status(200).json({ updateResponse })
  } catch (error) {
    logger.error(
      `Error adding favorite for user ${user_id} and estate ${req.params.id}: ${error.message}`,
      { module: 'EstateFavorites' }
    )
    res.status(500).json({ message: error.message })
  }
})

router.delete('/favorite/:id', authMiddleware, async (req, res) => {
  const user_id = req.user.user_id

  try {
    const updateResponse = await Estate.updateOne(
      { _id: req.params.id },
      { $pull: { favorites: user_id } }
    )

    logger.info(
      `User ${user_id} removed estate ${req.params.id} from favorites`,
      { module: 'EstateFavorites' }
    )
    res.status(200).json({ updateResponse })
  } catch (error) {
    logger.error(
      `Error removing favorite for user ${user_id} and estate ${req.params.id}: ${error.message}`,
      { module: 'EstateFavorites' }
    )
    res.status(500).json({ message: error.message })
  }
})

router.post('/flag/:id', authMiddleware, async (req, res) => {
  const user_id = req.user.user_id

  try {
    const updateResponse = await Estate.updateOne(
      { _id: req.params.id },
      { $addToSet: { flags: user_id } }
    )
    logger.info(`User ${user_id} flagged estate ${req.params.id}`, {
      module: 'EstateFlagging',
    })
    res.status(200).json({ updateResponse })
  } catch (error) {
    logger.error(
      `Error flagging estate ${req.params.id} by user ${user_id}: ${error.message}`,
      { module: 'EstateFlagging' }
    )
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
    logger.info(`Admin created new estate with title: ${title}`, {
      module: 'EstateCreation',
    })
    res.status(200).json(dataToSave)
  } catch (error) {
    logger.error(
      `Error creating estate with title: ${title} - ${error.message}`,
      { module: 'EstateCreation' }
    )
    res.status(400).json({ message: error.message })
  }
})

router.patch('/update/:id', adminAuthMiddleware, async (req, res) => {
  const id = req.params.id
  try {
    const updatedData = req.body
    const options = { new: true }

    const result = await Estate.findByIdAndUpdate(id, updatedData, options)

    logger.info(`Admin updated estate with ID: ${id}`, {
      module: 'EstateUpdate',
    })
    res.send(result)
  } catch (error) {
    logger.error(`Error updating estate with ID: ${id} - ${error.message}`, {
      module: 'EstateUpdate',
    })
    res.status(500).json({ message: error.message })
  }
})

router.delete('/delete/:id', adminAuthMiddleware, async (req, res) => {
  const id = req.params.id
  try {
    const data = await Estate.findByIdAndDelete(id)

    logger.info(`Admin deleted estate with ID: ${id}`, {
      module: 'EstateDeletion',
    })
    res.send({ message: `Estate ${data.name} has been deleted` })
  } catch (error) {
    logger.error(`Error deleting estate with ID: ${id} - ${error.message}`, {
      module: 'EstateDeletion',
    })
    res.status(400).json({ message: error.message })
  }
})

module.exports = router

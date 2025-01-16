const express = require('express')
const {createHistoricalPlace, getHistoricalPlaces, deleteHistoricalPlace, updateHistoricalPlace, getHistoricalPlaceTags, searchforHP, FilterMuseumByTagName, getMuseumByID} = require('../controllers/historicalPlaceController')
const router = express.Router()

router.get('/', getHistoricalPlaces)
router.get('/:id', getMuseumByID)


router.get('/:id/tags', getHistoricalPlaceTags)

//router.get('/:id', getWorkout)

router.post('/', createHistoricalPlace)

router.delete('/:id', deleteHistoricalPlace)

router.put('/:id', updateHistoricalPlace)
router.post('/filterByTag', FilterMuseumByTagName);
router.get('/search',searchforHP)
//router.patch('/:id', updateWorkout)

module.exports = router
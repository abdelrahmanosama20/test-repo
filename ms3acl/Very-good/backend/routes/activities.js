const express = require('express')
const {createActivity, getActivities, searchactivity,filterActivities,filterActivitiesyassin, getActivityById, addCommentToActivity} = require('../controllers/activityController')
const router = express.Router()

router.get('/', getActivities)
router.get('/search', searchactivity)

router.get('/:id', getActivityById);
//router.get('/:id', getWorkout)

router.post('/', createActivity)
router.post('/addComment', addCommentToActivity)

//router.delete('/:id', deleteWorkout)
router.post('/filterYassin',filterActivitiesyassin)
//router.patch('/:id', updateWorkout)
router.get('/filter', filterActivities)
module.exports = router
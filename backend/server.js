require('dotenv').config()
const express = require('express')
const touristRoutes = require('./routes/tourists')
const tourGuideRoutes = require('./routes/tourGuides')
const tourismGovernerRoutes = require('./routes/tourismGoverners')
const advertiserRoutes = require('./routes/advertisers')
const activityRoutes = require('./routes/activities')
const ItineraryRoutes = require('./routes/itineraries')
const historicalPlaceRoutes = require('./routes/historicalPlaces')
const productRoutes = require('./routes/products')
const sellerRoutes = require('./routes/sellers')
const adminRoutes = require('./routes/admins')
const mongoose = require('mongoose')
const cors = require('cors');

const app = express()

app.use(cors());

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/tourists', touristRoutes)
app.use('/api/tourGuides', tourGuideRoutes)
app.use('/api/tourismGoverners', tourismGovernerRoutes)
app.use('/api/advertisers', advertiserRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/itineraries', ItineraryRoutes)
app.use('/api/historicalPlaces', historicalPlaceRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sellers', sellerRoutes)
app.use('/api/admins', adminRoutes)

// connect to db
mongoose.connect(process.env.MONG_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}` )
        }) 
    })
    .catch(error => console.error('Database connection error:', error));
    
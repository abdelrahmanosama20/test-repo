require('dotenv').config()
const express = require('express')
const path = require('path'); // Ensure this line is included
const app = express()

const touristRoutes = require('./routes/tourists')
const tourGuideRoutes = require('./routes/tourGuides')
const tourismGovernerRoutes = require('./routes/tourismGoverners')
const advertiserRoutes = require('./routes/advertisers')
const activityRoutes = require('./routes/activities')
const ItineraryRoutes = require('./routes/itineraries')
const historicalPlaceRoutes = require('./routes/historicalPlaces')
const productRoutes = require('./routes/products')
const sellerRoutes = require('./routes/sellers')
const tagRoutes = require('./routes/tags')
const adminRoutes = require('./routes/admin')
const categoryRoutes = require('./routes/category')
const categoryRouter = require('./routes/category'); // Adjust the path as necessary
const complaintRoutes = require('./routes/complaints');
const bookingRoutes = require('./routes/bookingRoutes')
const transportationRoutes = require('./routes/transportations')
const flightOfferRoutes = require('./routes/flightOffers')
const flightInfoRoutes = require('./routes/flightInfos')
const hotelOfferRoutes = require('./routes/hotelOffers')
const hotelInfoRoutes = require('./routes/hotelInfos')
const loginRoutes = require('./routes/login'); // Adjust the path accordingly
const notificationRoutes = require('./routes/notifications')
const ordersRoutes = require('./routes/orders')
const promoCodeRoutes = require('./routes/promoCodes')


const mongoose = require('mongoose')
const cors = require('cors');



app.use(cors());

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
app.use('/api/categories', categoryRouter); // Register the category router

//To send a request that reaches the createTourist method, you'll need to construct your HTTP request URL based on how you've defined your routes in your Express app.
app.use('/api/tourists', touristRoutes)
app.use('/api/admins', adminRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/tourGuides', tourGuideRoutes)
app.use('/api/tourismGoverners', tourismGovernerRoutes)
app.use('/api/advertisers', advertiserRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/itineraries', ItineraryRoutes)
app.use('/api/historicalPlaces', historicalPlaceRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sellers', sellerRoutes)
app.use('/api/tags', tagRoutes)
// app.use('./routes/complaints', complaintRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/transportations', transportationRoutes)
//This means you tell your server to make the files in D:/UploadAcl accessible over the web.
app.use('/uploads', express.static(path.join(__dirname, 'middlewares/UploadAcl')));
app.use('/api/bookings',bookingRoutes)
app.use('/api/flightOffers', flightOfferRoutes)
app.use('/api/flightInfos', flightInfoRoutes)
app.use('/api/hotelOffers', hotelOfferRoutes)
app.use('/api/hotelInfos', hotelInfoRoutes)
app.use('/api/login', loginRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/promoCodes', promoCodeRoutes);


// connect to db
mongoose.connect(process.env.MONG_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT )
        }) 
    })
    .catch((error) => {
        console.log("couldn't connect to db ",error)
    })
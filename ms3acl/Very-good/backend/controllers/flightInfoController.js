const { default: mongoose } = require('mongoose')
const flightInfo = require('../models/flightInfoModel')

const createFlightInfo = async (req, res) => {
    try {
      const newInfo = new flightInfo(req.body);
      const savedInfo = await newInfo.save();
      res.status(201).json({
        message: 'Info created successfully',
        Info: savedInfo // Ensure this is the expected structure
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating Info', error });
    }
  };

  const getAllFLightInfo = async (req, res) => {
    try {
        const infos = await flightInfo.find(); // Fetch all Categories from the database
        res.status(200).json({
            message: 'infos retrieved successfully',
            data: infos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving infos',
            error: error.message
        });
    }
}

const getInfoByOfferId = async (req, res) => {
    try {
      const offerId = req.params.id; // Extract 'offerId' from req.params
      const info = await flightInfo.findOne({ offerId }); // Fetch by offerId instead of _id
  
      if (!info) {
        return res.status(404).json({
          message: 'Flight info not found',
        });
      }
  
      res.status(200).json({
        message: 'Flight info retrieved successfully',
        data: info
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error retrieving flight info',
        error: error.message
      });
    }
  };


  module.exports = {createFlightInfo, getAllFLightInfo, getInfoByOfferId,}
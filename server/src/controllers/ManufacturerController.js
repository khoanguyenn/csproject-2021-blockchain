/**
 * @author Ha Xuan Huy
 * @version 1.0
 */

const express = require("express")
const router = express.Router()
const ManufacturerMiddleware = require('../middleware/ManufacturerMiddleware');
const RenderMiddleware = require('../middleware/RenderMiddleware');
const AuthMiddleware = require('../middleware/AuthMiddleware');

// AuthMiddleware.verifyToken, AuthMiddleware.isManufacturer,
router.get('/',AuthMiddleware.verifyToken, AuthMiddleware.isManufacturer,RenderMiddleware.manufacturerPage);
router.get('/delivery', RenderMiddleware.manufacturerDeliveryPage);

//Get all vaccine lots of manufacturer
 router.get("/vaccines", ManufacturerMiddleware.getAllVaccineLot)
 router.get("/vaccines/:vaccineID", ManufacturerMiddleware.getVaccineLot)

//POST /manufacturer/vaccines with body request {"manufacturer":"value","name":"value","quantity":"value","dateOfManufacture":"value"}
//Create new vaccine lot
router.post('/vaccines', ManufacturerMiddleware.createVaccineLot)  

// PUT /manufacturer/delivery with body request {"vaccineLot":"value"}
//Transfers vaccine lot from manufacturer to distributor
 router.put("/delivery", ManufacturerMiddleware.deliverToDistributor)

//All manufacturer's delivery logs 
 router.get("/logs", ManufacturerMiddleware.getLogs)

// PUT /manufacturer/vaccines with body request {"vaccineLot":"value","name":"value","quantity":"value","dateOfManufacture":"value"}
// Update a vaccine lot in Manufacturer with specific ID

 router.put("/vaccines", ManufacturerMiddleware.updateVaccineLot)

// DELETE /manufacturer/vaccines with body request {"vaccineLot":"value"}
// Delete a vaccine lot with specific ID in Manufacturer

 router.delete("/vaccines", ManufacturerMiddleware.deleteVaccineLot)


module.exports = router
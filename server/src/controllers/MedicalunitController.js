/**
 * @author Pham Minh Huy
 */
 const express = require("express")
 const router = express.Router()
 const MedicalunitMiddleware = require('../middleware/MedicalunitMiddleware');
 const RenderMiddleware = require('../middleware/RenderMiddleware');
 const AuthMiddleware = require('../middleware/AuthMiddleware');
 
 
 router.get('/',AuthMiddleware.verifyToken, AuthMiddleware.isMedicalUnit,RenderMiddleware.medicalUnitPage);
 router.get('/delivery', RenderMiddleware.distributorDeliveryPage);
 
 router.get("users", MedicalunitMiddleware.getAllUsers);
 router.get("/vaccines", MedicalunitMiddleware.getAllUsers)
 router.get("/vaccines/:vaccineID", MedicalunitMiddleware.getVaccine);
 router.get("/logs", MedicalunitMiddleware.retrieveLogs)
 router.put("/vaccines", MedicalunitMiddleware.updateVaccineLot)
 router.delete("/vaccines", MedicalunitMiddleware.deleteVaccineLot)
 module.exports = router
/**
 * @author Pham Minh Huy
 */
const express = require("express")
const router = express.Router()
const DistributorMiddleware = require('../middleware/DistributorMiddleware');
const RenderMiddleware = require('../middleware/RenderMiddleware');
const AuthMiddleware = require('../middleware/AuthMiddleware');


router.get('/',AuthMiddleware.verifyToken, AuthMiddleware.isDistributor,RenderMiddleware.distributorPage);
router.get('/delivery', RenderMiddleware.distributorDeliveryPage);

router.get("/vaccines", DistributorMiddleware.GetDistributorLots)
router.get("/vaccines/:vaccineID", DistributorMiddleware.getVaccineLot)
router.put("/delivery", DistributorMiddleware.deliverToMedicalUnit)
router.get("/logs", DistributorMiddleware.retrieveLogs)
router.put("/vaccines", DistributorMiddleware.updateVaccineLot)
router.delete("/vaccines", DistributorMiddleware.deleteVaccineLot)
module.exports = router
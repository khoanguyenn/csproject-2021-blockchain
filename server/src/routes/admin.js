const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello world from admin");
})

router.get("/:org", (req, res) => {
    res.send("Hello admin from " + req.params.org);
})

module.exports = router;
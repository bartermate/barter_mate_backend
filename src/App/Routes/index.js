const express = require("express");
const registration = require("./RegistrationRoute");




// intializing express router
const router = express.Router();
// intializing express with JSON
router.use(express.json());

// Routes starting with specific path...

router.use("/registration-api", registration);



module.exports = router;

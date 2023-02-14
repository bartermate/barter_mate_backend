const express = require("express");
const router = express.Router();
const RegistrationController = require("../Controllers/RegistrationController");

router.post("/registration", RegistrationController.createRegistration);
router.post("/login", RegistrationController.login);
router.post("/addPickup", RegistrationController.createPickedup);
router.post("/guest", RegistrationController.gusetRegistration);
router.get("/guest", RegistrationController.getGuset);

router.post("/emailcheck", RegistrationController.emailcheck);
router.put("/updatePassword", RegistrationController.updatePassword);

router.post('/image', RegistrationController.roomImageUpload);
router.get('/image', RegistrationController.listAllimage);


router.get("/registration", RegistrationController.listAllRegistration);
router.get("/listPickedup", RegistrationController.listAllPickedup);

router.get(
  "/registration/:registrationId",
  RegistrationController.listRegistration
);
router.put(
  "/registration/:registrationId",
  RegistrationController.updateRegistration
);
router.delete(
  "/registration/:registrationId",
  RegistrationController.deleteRegistration
);

module.exports = router;

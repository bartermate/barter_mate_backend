const express = require("express");
const router = express.Router();
const RegistrationController = require("../Controllers/RegistrationController");

router.post("/registration", RegistrationController.createRegistration);
router.post("/login", RegistrationController.login);
router.post("/addPickup", RegistrationController.createPickedup);
router.post("/editPickup", RegistrationController.editPickup);
router.post("/guest", RegistrationController.gusetRegistration);
router.get("/guest", RegistrationController.getGuset);
router.put("/guest", RegistrationController.editGuest);
router.post("/Service", RegistrationController.addService);
router.get("/Service", RegistrationController.getService);




router.post("/emailcheck", RegistrationController.emailcheck);
router.put("/updatePassword", RegistrationController.updatePassword);

router.post("/rate", RegistrationController.addrate)
router.put("/rate/:rateId", RegistrationController.editRate);
router.delete("/rate/:rateId", RegistrationController.deleteRate);
router.get("/rate", RegistrationController.listAllRate);
router.get("/listPickedup", RegistrationController.listAllPickedup);
router.post("/pincode", RegistrationController.addPincode);
router.get("/pincode", RegistrationController.getPincode);
router.delete("/pincode", RegistrationController.deletePincode);
router.post("/pickedupHistoy", RegistrationController.pickedupHistoy);
router.post("/listAllRatebyPincode", RegistrationController.listAllRatebyPincode);
router.post("/addAddress", RegistrationController.addAddres);
router.post("/listAddAddress", RegistrationController.listAddAddress);
router.post("/deleteAddress", RegistrationController.deleteAddress);
router.post("/editAddress", RegistrationController.editAddress);





router.post('/image', RegistrationController.roomImageUpload);
router.get('/image', RegistrationController.listAllimage);


router.get("/registration", RegistrationController.listAllRegistration);


router.get(
  "/registration/:registrationId",
  RegistrationController.listRegistration
);
router.put(
  "/editUser",
  RegistrationController.editUser
);
router.put(
  "/registration/:registrationId",
  RegistrationController.updateRegistration
);
router.delete(
  "/user/:userId",
  RegistrationController.deleteRegistration
);
router.delete(
  "/guest/:guestId",
  RegistrationController.deleteGuest
);
router.delete(
  "/pickedup/:pickedupId",
  RegistrationController.deletePickup
);

module.exports = router;

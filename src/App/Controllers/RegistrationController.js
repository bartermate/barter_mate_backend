const Registration = require("../../Models/Registration");
const Rate = require("../../Models/Rate");
const Address = require("../../Models/Addess");
const Pincode = require("../../Models/Pincode");
const Guest = require("../../Models/Guest");
const Image = require("../../Models/Image");
const Service = require("../../Models/service");
const Pickedup = require("../../Models/Pickedup");
const bcrypt = require("bcrypt");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

/**
 * createCity
 * Here admin add new cms page
 * return JSON
 */
exports.createRegistration = async (req, res) => {
  if (
    req.body.password === null ||
    //  req.body.email === null ||
    req.body.password == undefined ||
    req.body.password == ""
    // req.body.email == undefined ||
    // req.body.email == ""
  ) {
    return res.status(400).json({ msg: "parameter missing..." });
  }
  try {
    const emailExist = await Registration.find({
      email: req.body.email,
      isDeleted: false,
    });
    const numberExist = await Registration.find({
      phone: req.body.phone,
      isDeleted: false,
    });
    if (emailExist.length > 0) {
      return res.status(401).json({ ack: 0, msg: "Email already exist" });
    } else if (numberExist.length > 0) {
      return res.status(401).json({ ack: 0, msg: "Number already exist" });
    } else {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const addUser = await new Registration({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        landMark: req.body.landMark,
        password: hash,
        pinCode: req.body.pinCode,
        is_verified: true,
        is_Active: true,
      }).save();
      res.status(200).json({
        ack: 1,
        msg: "You are successfullyy registered.",
        data: addUser,
      });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error", data: error });
  }
};

exports.gusetRegistration = async (req, res) => {
  try {
    // const emailExist = await Guest.find({
    //   email: req.body.email,
    //   isDeleted: false,
    // });
    // if (emailExist.length > 0) {
    //   res.status(200).json({ ack: 0, msg: "Email already exist" });
    // } else {
    //  const hash = bcrypt.hashSync(req.body.password, 10);
    const addUser = await new Guest({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      landMark: req.body.landMark,
      pickupDate: req.body.pickupDate,
      // shift:req.body.shift,
      // remark:req.body.remark,
      // feedback:req.body.feedback,
      pinCode: req.body.pinCode,
      category: req.body.category,
      subcategory: req.body.subcategory,
      is_verified: true,
      is_Active: true,
    }).save();
    res.status(200).json({
      ack: 1,
      msg: "You are successfullyy Added GUEST User.",
      data: addUser,
    });
    //}
  } catch (error) {
    res.status(500).json({ msg: "Server error", data: error });
  }
};

exports.getGuset = async (req, res) => {
  try {
    let filterData = {};
    filterData.isDeleted = false;
    const registration = await Guest.find(filterData);
    res.status(200).json({ data: registration });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", data: err });
  }
};
//pickedup
exports.createPickedup = async (req, res) => {
  if (
    req.body.email === null ||
    req.body.email == undefined ||
    req.body.email == ""
  ) {
    return res.status(400).json({ msg: "parameter missing..." });
  }
  try {
    // const emailExist = await Pickedup.find({
    //   email: req.body.email,
    //   isDeleted: false,
    // });
    // if (emailExist.length > 0) {
    //   res.status(200).json({ ack: 0, msg: "Email already exist" });
    // } else {
    const addUser = await new Pickedup({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      landMark: req.body.landMark,
      pinCode: req.body.pinCode,
      pickupDate: req.body.pickupDate,
      subcategory: req.body.subcategory,
      // shift:req.body.shift,
      // remark:req.body.remark,
      // feedback:req.body.feedback,
      category: req.body.category,
      is_verified: true,
      is_Active: true,
    }).save();
    res.status(200).json({
      ack: 1,
      msg: "You are successfullyy added Pickedup.",
      data: addUser,
    });
    // }
    // });
    //}
  } catch (error) {
    res.status(500).json({ msg: "Server error", data: error });
  }
};

//login
exports.login = async (req, res) => {
  if (
    req.body.password === null ||
    req.body.password == undefined ||
    req.body.password == "" 
  ) {
    return res.status(400).json({ msg: "parameter missing..." });
  }
  if (req.body.type == "email") {
    Registration.findOne({
      email: req.body.email,
    })
      .then((userDetails) => {
        bcrypt
          .compare(req.body.password, userDetails.password)
          .then((isMatch) => {
            if (isMatch) {
              if (userDetails.isActive == true) {
                let token = jwt.sign(
                  { id: userDetails._id },
                  "nodeJS-mongoDBsecretkey",
                  { algorithm: "HS256", expiresIn: "30d" }
                ); // expires in 30 days
                const result = {
                  userDetails: userDetails,
                  token: token,
                };
                return res.status(200).json({
                  ack: true,
                  msg: "Successfully loggedin",
                  data: result,
                });
              } else {
                return res
                  .status(201)
                  .json({ ack: false, msg: "You account is not active" });
              }
            } else {
              return res
                .status(201)
                .json({
                  ack: false,
                  msg: "Invalid password and  Invalid email",
                });
            }
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ ack: false, msg: "Something not right", data: err });
          });
      })
      .catch((err) => {
        return res
          .status(401)
          .json({ ack: false, msg: "Invalid email", data: err });
      });
  }
  if (req.body.type == "number") {
    Registration.findOne({
      phone: req.body.email,
    })
      .then((userDetails) => {
        bcrypt
          .compare(req.body.password, userDetails.password)
          .then((isMatch) => {
            if (isMatch) {
              if (userDetails.isActive == true) {
                let token = jwt.sign(
                  { id: userDetails._id },
                  "nodeJS-mongoDBsecretkey",
                  { algorithm: "HS256", expiresIn: "30d" }
                ); // expires in 30 days
                const result = {
                  userDetails: userDetails,
                  token: token,
                };
                return res.status(200).json({
                  ack: true,
                  msg: "Successfully loggedin",
                  data: result,
                });
              } else {
                return res
                  .status(201)
                  .json({ ack: false, msg: "You account is not active" });
              }
            } else {
              return res
                .status(201)
                .json({
                  ack: false,
                  msg: "Invalid password and  Invalid email",
                });
            }
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ ack: false, msg: "Something not right", data: err });
          });
      })
      .catch((err) => {
        return res
          .status(401)
          .json({ ack: false, msg: "Invalid email", data: err });
      });
  }
};
/**
 * listAllCms
 * Here fetch all cms pages
 * return JSON
 * 31 - ?
 */
exports.listAllRegistration = async (req, res) => {
  try {
    let filterData = {};
    filterData.isDeleted = false;
    const registration = await Registration.find(filterData);
    res.status(200).json({ data: registration });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", data: err });
  }
};

//list all pickedup
exports.listAllPickedup = async (req, res) => {
  try {
    let filterData = {};
    filterData.isDeleted = false;
    if (req.body.date) {
      filterData.createdDate = {
        $gte: new Date(new Date(req.body.date).setHours(00, 00, 00)),
        $lte: new Date(new Date(req.body.date).setHours(23, 59, 59)),
      };
    }
    const registration = await Pickedup.find(filterData);
    res.status(200).json({ data: registration });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", data: err });
  }
};

/**
 * listCms
 * Here fetch all cms pages
 * return JSON
 */
exports.listRegistration = async (req, res) => {
  if (req.params.registrationId == null) {
    return res.status(400).jsn({ msg: "Parameter missing..." });
  }
  try {
    const registration = await Registration.findById({
      _id: req.params.registrationId,
    });
    res.status(200).json({ data: registration });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", data: err });
  }
};

/**
 * updateCms
 * Here update cms page
 * return JSON
 */
exports.updateRegistration = async (req, res) => {
  if (req.params.registrationId == null) {
    return res.status(400).json({ msg: "Parameter missing..." });
  }
  try {
    const city = await Registration.findByIdAndUpdate(
      { _id: req.params.registrationId },
      {
        $set: {
          isActive: req.body.isActive,
        },
      }
    );
    res.status(200).json({ msg: "Registration updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

/**
 * deleteCms
 * Here delete cms page
 * return JSON
 */
exports.deleteRegistration = async (req, res) => {
  if (!req.params.userId) {
    return res.status(400).json({ msg: "Parameter missing..." });
  }
  try {
    const registration = await Registration.findByIdAndDelete(
      { _id: req.params.userId }
    );
    res.status(200).json({ msg: "Registration deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};
exports.deleteGuest = async (req, res) => {
  if (!req.params.guestId) {
    return res.status(400).json({ msg: "Parameter missing... guestId" });
  }
  try {
    const registration = await Guest.findByIdAndDelete(
      { _id: req.params.guestId }
    );
    res.status(200).json({ msg: "guest deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};
exports.deletePickup = async (req, res) => {
  if (!req.params.pickedupId) {
    return res.status(400).json({ msg: "Parameter missing... pickedupId" });
  }
  try {
    const registration = await Pickedup.findByIdAndDelete(
      { _id: req.params.pickedupId }
    );
    res.status(200).json({ msg: "pickedup deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};
exports.roomImageUpload = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res
        .status(200)
        .json({ ack: false, msg: "Please Choose image file !!!" });
    }
    console.log(req.files.image);
    const S3_BUCKET_NAME = "bartermate1";
    const s3 = new AWS.S3({
      accessKeyId: "AKIA35SLNSUMK5AGZN6W",
      secretAccessKey: "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",
      region: "ap-south-1",
    });
    let total_image = [];
    let setData = {
      image: total_image,
    };
    for (let i = 0; i <= req.files.image.length; i++) {
      if (total_image.length == req.files.image.length) {
        const updatechef = await Image.findByIdAndUpdate(
          { _id: "62dfdaf1478bf46668347412" },
          {
            $set: setData,
          }
        );
        return res
          .status(200)
          .json({ ack: true, msg: "Successfully  image upload" });
      }
      var base64data = await Buffer.from(req.files.image[i].data);
      console.log("image")
      const params = {
        Bucket: S3_BUCKET_NAME, // pass your bucket name
        Key: `${req.files.image[i].name}`, // file will be saved
        Body: base64data,
        ACL: "public-read",
        CacheControl: "no-cache",
      };

      const ResponseData = await s3.upload(params).promise();
      console.log("working")
      let image = ResponseData.Location;
      total_image.push({ image });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", err: err });
  }
};

exports.listAllimage = async (req, res) => {
  try {
    const image = await Image.findById({ _id: "62dfdaf1478bf46668347412" });
    return res.status(200).json({ data: image });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", data: err });
  }
};

exports.emailcheck = async (req, res) => {
  try {
    // if (
    //   req.body.email === null ||
    //   req.body.email == undefined ||
    //   req.body.email == ""
    // ) {
    //   return res.status(400).json({ msg: "parameter missing..." });
    // }
    const registration = await Registration.findOne({ $or: [ { email: req.body.email }, { phone: req.body.number } ] });
    if (!registration) {
      return res.status(404).json({ msg: "Email Not Found" });
    }
    return res.status(200).json({ msg: "Data Found!!!", data: registration });
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong", data: error });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    if (
      req.body.userId === null ||
      req.body.userId == undefined ||
      req.body.userId ==  ""
    ) {
      return res.status(400).json({ msg: "parameter missing... userId" });
    }
    if (
      req.body.password === null ||
      req.body.password == undefined ||
      req.body.password == ""
    ) {
      return res.status(400).json({ msg: "parameter missing... password" });
    }
    const hash = bcrypt.hashSync(req.body.password, 10);
    const data = await Registration.findByIdAndUpdate(
      { _id: req.body.userId },
      {
        $set: {
          password: hash,
        },
      }
    );
    if (data) {
      return res.status(200).json({ msg: "PassWord Updated Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong", data: error });
  }
};

exports.addrate = async (req, res) => {
  try {
    if (
      req.body.pincode === null ||
      req.body.value === null ||
      req.body.value == "" ||
      req.body.value == undefined ||
      req.body.category === null ||
      req.body.pincode == undefined ||
      req.body.pincode == "" ||
      req.body.category == undefined ||
      req.body.category == ""
    ) {
      return res.status(400).json({ msg: "parameter missing..." });
    }
    const rateExist = await Rate.findOne({
      pincode: req.body.pincode,
      category: req.body.category,
      isDeleted: false,
    });
    if (rateExist) {
      return res.status(401).json({ ack: 0, msg: "Rate already exist" });
    }
    const rate = await new Rate({
      pincode: req.body.pincode,
      category: req.body.category,
      value: req.body.value,
    }).save();
    res
      .status(200)
      .json({ ack: 1, msg: "You are successfully Added Rate.", data: rate });
  } catch (error) {
    res.status(500).json({ msg: "Server error", data: error });
  }
};

exports.listAllRate = async (req, res) => {
  try {
    const allRate = await Rate.find({ isDeleted: false });
    return res.status(200).json({ data: allRate });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", data: err });
  }
};

exports.listAllRatebyPincode = async (req, res) => {
  try {
    if (
      req.body.pincode == undefined ||
      req.body.pincode == "" ||
      req.body.pincode === null
    ) {
      return res.status(400).json({ msg: "Pincode missing..." });
    }
    const allRate = await Rate.find({
      isDeleted: false,
      pincode: req.body.pincode,
    });
    return res.status(200).json({ data: allRate });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", data: err });
  }
};

exports.editRate = async (req, res) => {
  if (req.params.rateId == null) {
    return res.status(400).json({ msg: "Parameter missing..." });
  }
  try {
    const city = await Rate.findByIdAndUpdate(
      { _id: req.params.rateId },
      {
        $set: {
          category:req.body.category,
          value: req.body.value,
        },
      }
    );
    res.status(200).json({ msg: "Rate updated successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

exports.deleteRate = async (req, res) => {
  if (req.params.rateId == null) {
    return res.status(400).json({ msg: "Parameter missing..." });
  }
  try {
    const city = await Rate.findByIdAndDelete(
      { _id: req.params.rateId }
    );
    res.status(200).json({ msg: "Rate Delete successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

exports.editPickup = async (req, res) => {
  if (
    req.body.PickedupID == null ||
    req.body.PickedupID == "" ||
    req.body.PickedupID == undefined
  ) {
    return res.status(400).json({ msg: "Parameter missing..." });
  }
  try {
    const city = await Pickedup.findByIdAndUpdate(
      { _id: req.body.PickedupID },
      {
        $set: {
          isComplete: true,
        },
      }
    );
    res.status(200).json({ msg: "Pickedup  successfully Complete" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

exports.pickedupHistoy = async (req, res) => {
  try {
    if (
      req.body.email == null ||
      req.body.email == "" ||
      req.body.email == undefined
    ) {
      return res.status(400).json({ msg: "Parameter missing..." });
    }
    let filterData = {
      email: req.body.email,
    };
    filterData.isDeleted = false;
    const registration = await Pickedup.find(filterData);
    res.status(200).json({ data: registration });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", data: err });
  }
};

exports.addAddres = async (req, res) => {
  if (
    req.body.userId === null ||
    req.body.userId == undefined ||
    req.body.userId == ""
  ) {
    return res.status(400).json({ msg: "userId missing..." });
  }
  try {
    const addUser = await new Address({
      userId: req.body.userId,
      email: req.body.email,
      phone: req.body.phone,
      address1: req.body.address1,
      address2: req.body.address2,
      landMark: req.body.landMark,
      pinCode: req.body.pinCode,
      city: req.body.city,
      tags: req.body.tags,
      state: req.body.state,
      is_verified: true,
      is_Active: true,
    }).save();
    res.status(200).json({
      ack: 1,
      msg: "You are successfullyy added Adderss.",
      data: addUser,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", data: error });
  }
};

exports.listAddAddress = async (req, res) => {
  try {
    if (
      req.body.userId == null ||
      req.body.userId == "" ||
      req.body.userId == undefined
    ) {
      return res.status(400).json({ msg: "Parameter missing..." });
    }
    let filterData = {
      userId: req.body.userId,
    };
    filterData.isDeleted = false;
    const registration = await Address.find(filterData)
      .populate("userId")
      .exec();
    res.status(200).json({ data: registration });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", data: err });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    if (
      req.body.userId === null ||
      req.body.userId == undefined ||
      req.body.userId == ""
    ) {
      return res.status(400).json({ msg: "userId missing..." });
    }
    if (
      req.body.addressId === null ||
      req.body.addressId == undefined ||
      req.body.addressId == ""
    ) {
      return res.status(400).json({ msg: "addressId missing..." });
    }
    const registration = await Address.findByIdAndDelete({
      _id: req.body.addressId,
    }).exec();
    return res.status(200).json({ msg: "You are successfully Deleted Address." });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", data: err });
  }
};

exports.editAddress = async (req, res) =>{
  try {
    if (
      req.body.userId === null ||
      req.body.userId == undefined ||
      req.body.userId == ""
    ) {
      return res.status(400).json({ msg: "userId missing..." });
    }
    if (
      req.body.addressId === null ||
      req.body.addressId == undefined ||
      req.body.addressId == ""
    ) {
      return res.status(400).json({ msg: "addressId missing..." });
    }
    const city = await Address.findByIdAndUpdate(
      { _id: req.body.addressId },
      {
        $set: req.body
      }
    );
   
    return res.status(200).json({ msg: "You are successfully Edit Address." });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", data: err });
  }
},

exports.editUser = async (req, res) => {
  if (
    req.body.userId == null ||
    req.body.userId == "" ||
    req.body.userId == undefined 
  ) {
    return res.status(400).json({ msg: "Parameter missing..." });
  }
  try {
    const city = await Registration.findByIdAndUpdate(
      { _id: req.body.userId },
      {
        $set: req.body
      }
    );
    res.status(200).json({ msg: "Updated" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

exports.editGuest = async (req, res) => {
  if (
    req.body.guestId == null ||
    req.body.guestId == "" ||
    req.body.guestId == undefined
  ) {
    return res.status(400).json({ msg: "Parameter missing..." });
  }
  try {
    const city = await Guest.findByIdAndUpdate(
      { _id: req.body.guestId },
      {
        $set: {
          isComplete: true,
        },
      }
    );
    res.status(200).json({ msg: "Pickedup  successfully Complete" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

exports.addService = async (req, res) => {
  if (
    req.body.userId === null ||
    req.body.userId == undefined ||
    req.body.userId == ""
  ) {
    return res.status(400).json({ msg: "userId missing..." });
  }
  try {
    const ServiceExist = await Service.find({
      userId: req.body.userId,
      serviceName: req.body.serviceName,
      isService: req.body.isService,
      isDeleted: false,
    });
    if (ServiceExist.length > 0) {
      return res.status(401).json({ ack: 0, msg: "Service already exist" });
    }
    const addUser = await new Service({
      userId: req.body.userId,
      serviceName: req.body.serviceName,
      isService: req.body.isService,
    }).save();
    res.status(200).json({
      ack: 1,
      msg: "You are successfullyy added",
      data: addUser,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", data: error });
  }
};

exports.getService = async (req, res) => {
  try {
    let filterData = {
      isDeleted: false,
    };
    const registration = await Service.find(filterData)
      .populate("userId")
      .exec();
    res.status(200).json({ data: registration });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", data: err });
  }
};

exports.addPincode = async (req, res) => {
  try {
    if (
      req.body.pincode === null ||
      req.body.pincode == undefined ||
      req.body.pincode == "" 
    ) {
      return res.status(400).json({ msg: "parameter missing... Pincode" });
    }
    const rateExist = await Pincode.findOne({
      pincode: req.body.pincode,
      isDeleted: false,
    });
    if (rateExist) {
      return res.status(401).json({ ack: 0, msg: "Pincode already exist" });
    }
    const rate = await new Pincode({
      pincode: req.body.pincode
    }).save();
    res
      .status(200)
      .json({ ack: 1, msg: "You are successfully Added Pincode.", data: rate });
  } catch (error) {
    res.status(500).json({ msg: "Server error", data: error });
  }
}
exports.getPincode = async (req, res) => {
  try {
    let filterData = {
      isDeleted: false,
    };
    const registration = await Pincode.find(filterData)
      .exec();
      let temp = [];
      for(let el in registration ){
        temp.push(registration[el].pincode)
      }
    res.status(200).json({ data: temp });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", data: err });
  }
}

exports.deletePincode = async (req, res) => {
  try {
    if (
      req.body.pincode === null ||
      req.body.pincode == undefined ||
      req.body.pincode == "" 
    ) {
      return res.status(400).json({ msg: "parameter missing... Pincode" });
    }
    const registration = await Pincode.findOneAndRemove({pincode:req.body.pincode})
      .exec();
    res.status(200).json({msg:"You are successfully Deleted Pincode." });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong", data: err });
  }
}

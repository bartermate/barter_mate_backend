const Registration = require("../../Models/Registration");
const Guest = require("../../Models/Guest");
const Image = require("../../Models/Image");
const Pickedup = require("../../Models/Pickedup");
const bcrypt = require('bcrypt');
const AWS = require("aws-sdk");
const jwt = require('jsonwebtoken');


/**
 * createCity
 * Here admin add new cms page
 * return JSON
 */
exports.createRegistration = async (req, res) => {
  if (req.body.password === null || req.body.email === null ||req.body.password == undefined||req.body.password == ''||req.body.email == undefined||req.body.email == '') {
    return res.status(400).json({ msg: "parameter missing..." });
  }
  try {
    const emailExist = await Registration.find({
      email: req.body.email,
      is_deleted: false,
    });
    if (emailExist.length > 0) {
      res.status(200).json({ ack: 0, msg: "Email already exist" });
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
          res.status(200).json({ ack: 1, msg: "You are successfullyy registered.",data:addUser });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" ,data:error});
  }
};

exports.gusetRegistration = async (req, res) => {
  try {
    const emailExist = await Guest.find({
      email: req.body.email,
      is_deleted: false,
    });
    if (emailExist.length > 0) {
      res.status(200).json({ ack: 0, msg: "Email already exist" });
    } else {
      //  const hash = bcrypt.hashSync(req.body.password, 10);
          const addUser = await new Guest({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            landMark: req.body.landMark,
            pickupDate:req.body.pickupDate,
            shift:req.body.shift,
            remark:req.body.remark,
            feedback:req.body.feedback,
            pinCode: req.body.pinCode,
            category: req.body.category,
            is_verified: true,
            is_Active: true,
          }).save();
          res.status(200).json({ ack: 1, msg: "You are successfullyy Added GUEST User.",data:addUser });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" ,data:error});
  }
};

exports.getGuset = async (req, res) => {
  try {
    let filterData = {};
    filterData.isDeleted = false;
    const registration = await Guest.find(filterData);
    res.status(200).json({ data: registration });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" ,data:err});
  }
};
//pickedup
exports.createPickedup = async (req, res) => {
  if (req.body.email === null ||req.body.email == undefined||req.body.email == '') {
    return res.status(400).json({ msg: "parameter missing..." });
  }
  try {
    const emailExist = await Pickedup.find({
      email: req.body.email,
      is_deleted: false,
    });
    if (emailExist.length > 0) {
      res.status(200).json({ ack: 0, msg: "Email already exist" });
    } else {
          const addUser = await new Pickedup({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            landMark: req.body.landMark,
            pinCode: req.body.pinCode,
            pickupDate:req.body.pickupDate,
            shift:req.body.shift,
            remark:req.body.remark,
            feedback:req.body.feedback,
            category: req.body.category,
            is_verified: true,
            is_Active: true,
          }).save();
          res.status(200).json({ ack: 1, msg: "You are successfullyy added Pickedup.",data:addUser });
       // }
     // });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error" ,data:error});
  }
};

//login
exports.login =async (req, res) => {
  if (req.body.password === null || req.body.email === null ||req.body.password == undefined||req.body.password == ''||req.body.email == undefined||req.body.email == '') {
    return res.status(400).json({ msg: "parameter missing..." });
  }
  Registration.findOne({
    email: req.body.email
  })
    .then(userDetails => {
      bcrypt.compare(req.body.password, userDetails.password)
        .then(isMatch => {
          if (isMatch) {
            if (userDetails.isActive == true) {
              let token = jwt.sign({ id: userDetails._id }, 'nodeJS-mongoDBsecretkey', { algorithm: "HS256", expiresIn: "30d" }); // expires in 30 days
              const result = {
                userDetails: userDetails,
                token: token
              };
              res.status(200).json({ ack: true, msg: "Successfully loggedin", data: result });
            } else {
              res.status(201).json({ ack: false, msg: "You account is not active" });
            }
          } else {
            res.status(201).json({ ack: false, msg: "Invalid password and  Invalid email" });
            
          }
        })
        .catch(err => {
          res.status(500).json({ ack: false, msg: "Something not right" ,data:err});
        });
    })
    .catch(err => {
      res.status(401).json({ ack: false,msg: "Invalid email" ,data:err});
    });
}
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
    res.status(500).json({ msg: "Something went wrong" ,data:err});
  }
};

//list all pickedup
exports.listAllPickedup = async (req, res) => {
  try {
    let filterData = {};
    filterData.isDeleted = false;
    if(req.body.date){
      filterData.createdDate = {
        $gte: new Date(new Date(req.body.date).setHours(00, 00, 00)),
        $lte: new Date(new Date(req.body.date).setHours(23, 59, 59)),
      };
    }
    const registration = await Pickedup.find(filterData);
    res.status(200).json({ data: registration });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" ,data:err});
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
    res.status(500).json({ msg: "Something went wrong",data:err });
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
  if (req.params.registrationId == null) {
    return res.status(400).json({ msg: "Parameter missing..." });
  }
  try {
    const registration = await Registration.findByIdAndUpdate(
      { _id: req.params.registrationId },
      {
        $set: {
          isDeleted: true,
        },
      }
    );
    res.status(200).json({ msg: "Registration deleted successfully" });
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
    console.log(req.files.image)
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
          { _id: "61f520daf90d523230a5acd3" },
          {
            $set: setData,
          }
        );
        return res
          .status(200)
          .json({ ack: true, msg: "Successfully  image upload" });
        break;
      }
      var base64data = await Buffer.from(req.files.image[i].data);
      const params = {
        Bucket: S3_BUCKET_NAME, // pass your bucket name
        Key: `${req.files.image[i].name}`, // file will be saved
        Body: base64data,
        ACL: "public-read",
        CacheControl: "no-cache",
      };

      const ResponseData = await s3.upload(params).promise();
      let image = ResponseData.Location;
      total_image.push({ image });
    }
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", err: err });
  }
};

exports.listAllimage = async (req, res) => {
  try {
    const image = await Image.findById({_id: "61f520daf90d523230a5acd3" });
    return res.status(200).json({ data: image });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong" ,data:err});
  }
};

exports.emailcheck = async (req, res) => {
  try {
    if (req.body.email === null ||req.body.email == undefined||req.body.email == '') {
      return res.status(400).json({ msg: "parameter missing..." });
    }
    const registration = await Registration.findOne({email:req.body.email});
    if(!registration){
      return  res.status(404).json({ msg: "Email Not Found" });
    }
    return res.status(200).json({ msg:"Email Found!!!" ,data: registration });
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong" ,data:error});
  }
};

exports.updatePassword = async (req, res) => {
  try {
    if (
      req.body.userId === null ||
      req.body.userId == undefined ||
      req.body.userId == ""
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

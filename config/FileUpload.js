const multer  = require('multer')

/*upload property picture*/
const roomImageStore = multer.diskStorage({
    destination: (req, file, cb) => {
       // console.log('request==',req);
        //console.log('file==',file);
        cb(null, __basedir+ "/uploads" + "/image/")
    },
    filename: (req, file, cb) => {
        cb(null,file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
});
exports.uploadRoomImage = multer({
    storage: roomImageStore,
    limits: {
        fileSize: 70 * 1024 * 1024,  // 70 MB,
        files: 10
    }
}).array('image',10);
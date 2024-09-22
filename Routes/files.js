const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../module/file');
const {v4: uuid} = require('uuid');



let storage = multer.diskStorage({
    destination: (req, file , cb) =>  cb(null, 'uploads/' ),
    filename: (req, file , cb ) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)} `;
        cb(null,uniqueName);
    }
})

let upload = multer({
storage,
limit: {fileSize: 1000000*100},

}).single('myfile');
router.post('/', (req, res)=>{
  

    upload(req, res ,  async (err) =>{


        if(!req.file){
            return res.json({ error : "all fields are required"});
        }


        if(err){
            return res.status(500).send({ error: err.message})
        }


        const file =  new File({
           filename: req.file.filename,
           uuid: uuid(),
           path: req.file.path,
           size: req.file.size,
        });

        const response = await file.save();
        return res.json({file: `${process.env.APP_BASE_URL}/file/${response.uuid}`})

    





    });




   


});

router.post('/send', async (req,res)=>{
    const {uuid, emailTo, emailFrom} = req.body;

    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error: 'all fiels are required'});

    }
    //get data from the database
    const file = await File.findOne({uuid: uuid});
    if(file.sender){
        return res.status(420).send({error: 'Email already sent'});

    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();


    //send email
    const sendMail = require("../services/emailService")
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'filo file sharing ',
        text: `${emailFrom} shared a file with You.`,
        html: require(`../services/emailTemplate`)({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + 'kb',
            expires: '24 hours'

        })
    });
    return res.send({success: "email  sent "})

});

module.exports = router;

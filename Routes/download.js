const router = require('express').Router();
const path = require('path');
const fs = require('fs');

const File = require('../module/file')



router.get("/:uuid", async(req,res) =>{

    console.log("Route hit: GET /:uuid");
    const file = await File.findOne({uuid: req.params.uuid}) ;
    if(!file){
        return res.render('download',{error: 'link has been expired'});
    }

    const filePath = path.join(__dirname, '..', file.path);
    console.log('File Path:', filePath);

    if (!fs.existsSync(filePath)) {
        console.log('File does not exist on the server.');
        return res.render('download', { error: 'File not found on server' });
    }




    res.download(filePath);

});


module.exports = router;